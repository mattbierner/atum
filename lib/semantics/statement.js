/**
 * @fileOverview ECMAScript 5.1 statement semantics.
 */
define(['atum/compute',
        'atum/completion',
        'atum/fun',
        'atum/compute/statement',
        'atum/environment_reference',
        'atum/operations/boolean',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/type_conversion',
        'atum/operations/internal_reference',
        'atum/operations/iref',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/semantics/expression',
        'atum/value/value'],
function(compute,
        completion,
        fun,
        statement,
        environment_reference,
        boolean,
        environment,
        error,
        type_conversion,
        internal_reference,
        iref,
        object,
        string,
        value_reference,
        expression,
        value){
"use strict";

/* Base Operations
 ******************************************************************************/
var statementNext = function(p, q) {
    //if (!p.stmt || !q.stmt)
    //    debugger;
    
    return statement.bind(p, function(x) {
      if (x instanceof completion.AbruptCompletion)
            return statement.just(x)
        
        return statement.bind(q, function(y) {
            switch (y.type) {
            case completion.NormalCompletion.type:
                return statement.completeNormal(
                    (y.value === null ? x.value : y.value));
            
            case completion.BreakCompletion.type:
                return statement.completeBreak(
                    y.target,
                    (y.value === null ? x.value : y.value));
            
             case completion.ContinueCompletion.type:
                return statement.completeContinue(
                    y.target,
                    (y.value === null ? x.value : y.value));
            
             case completion.ThrowCompletion.type:
                 return statement.completeThrow(y.value, x);
                 
             default:
                 return statement.just(y);
            }
        });
    });
};

/**
 * Semantics for a list of statements.
 * 
 * Evaluates statements in order until a completion is found or no more statements
 * are left.
 * 
 * @param statements Array of statement computations to evaluate in order.
 * 
 * @return First completion or result of last statement.
 */
var statementList = fun.curry(fun.reduce, statementNext, statement.empty);

/**
 * Capture the current environment, perform computation `p`, then restore old environment.
 */
var environmentBlock = function(p) {
    return statement.bindExpression(environment.getEnvironment, function(oldEnv) {
        return statement.bind(p, function(x) {
            return statement.bindExpression(
                environment.setEnvironment(oldEnv),
                fun.constant(statement.just(x)));
        });
    });
};

var sink = function(p) {
    return statement.next(
        p,
        emptyStatement);
};

/* Statement Semantics
 ******************************************************************************/
/**
 * Empty statement.
 * 
 * Completes normally without a value.
 */
var emptyStatement = statement.empty;

/**
 * Expression statement
 * 
 * Evaluates an expression and completes normally with the result.
 * 
 * @param expr Expression to evaluate.
 */
var expressionStatement = fun.compose(
    statement.liftExpression,
    internal_reference.getFrom);

/**
 * Debugger statement
 */
var debuggerStatement = emptyStatement;


/**
 * Block statement
 * 
 * Evaluates a sequence of statements in order
 * 
 * @param statements Array of statements.
 */
var blockStatement = statementList;

/**
 * With statement
 * 
 * Creates a new object environment from the result of an expression and evaluates
 * a statement in this environment.
 * 
 * @param expr Expr giving object for object environment.
 * @param body Statement to evaluate in the resulting object environment.
 */
var withStatement = function(expr, body) {
    return environmentBlock(
        statement.next(
            expressionStatement(
                compute.bind(
                    compute.bind(
                        internal_reference.dereferenceFrom(expr, type_conversion.toObject),
                        environment.createCurrentObjectEnvironment),
                    environment.setEnvironment)),
            body));
};

/* Declaration
 ******************************************************************************/
/**
 * Variable declarations statement.
 */
var declarationStatement = fun.compose(
    sink,
    fun.compose(
        statementList,
        fun.curry(fun.map, statement.liftExpression)));

/* Completion Statements
 ******************************************************************************/
/**
 * Return statement
 * 
 * @param argument Computation of value to return.
 */
var returnStatement = statement.composeExpression(
    internal_reference.getFrom,
    statement.completeReturn);

/**
 * Throw statement
 * 
 * @param argument Computation of value to throw.
 */
var throwStatement = statement.composeExpression(
    internal_reference.getFrom,
    statement.completeThrow);

/**
 * Break statement
 * 
 * @param {String} [label]
 */
var breakStatement = statement.completeBreak;

/**
 * Continue statement
 * 
 * @param {String} [label]
 */
var continueStatement = statement.completeContinue;

/* Flow Control Statements
 ******************************************************************************/
/**
 * If statement
 * 
 * @param test Computation of value to branch on.
 * @param consequent Statement-like computation evaluated if 'test' is a truthy
 *    value.
 * @param alternate Statement-like computation evaluated if 'test' is a falsy
 *    value.
 */
var ifStatement = function(test, consequent, alternate) {
    return statement.bindExpression(
        internal_reference.dereferenceFrom(test, boolean.isTrue),
        function(isTrue) {
            return (isTrue ? consequent : alternate);
        });
};

/**
 * Semantics for a single switch case clause.
 * 
 * Switch behavior, such as fallthrough, is handled in 'switchStatement'.
 * 
 * @param discriminant Computation the switch is discriminating on.
 * @param test Computation to test the 'discriminate' against.
 * @param consequent Computation to evaluate if 'discriminant' and 'test' results
 *    in true.
 * @param alternate Computation to evaluate if 'discriminant' and 'test' results
 *    in false.
 */
var _switchCase = function(discriminant, test, consequent, alternate) {
    return ifStatement(
        expression.strictEqualOperator(test, discriminant),
        consequent,
        alternate);
};

/**
 * Semantics for a switch statement.
 * 
 * Cases may fall through if no completion is found in their body. The cases
 * fall through in case order, from pre to default to post.
 * Default case will be evaluated when no other cases and may also fall through to postCases.
 * 
 * @param discriminant Computation the switch is discriminating on. This is only
 *    evaluated once and the result is cached.
 * @param preCases Array of cases before the default case.
 * @param defaultCase Case to evaluate when no other cases succeed.
 * @param postCases Array of cases after the default clause.
 * 
 * @TODO: ugly
 */
var switchStatement = function(discriminant, preCases, defaultCase, postCases) {
    var behaviors = [].concat(
        preCases.map(function(x) { return x.consequent; }),
        [defaultCase.consequent],
        postCases.map(function(x) { return x.consequent; }));
    
    var consequents = fun.reduceRight(function(p, c) {
        return [statementList([c].concat(p))].concat(p);
    }, [], behaviors);
    
    var defaultBehavior = consequents[preCases.length];
    
    return statement.bindExpression(
        discriminant,
        function(x) {
            var discriminant = compute.just(x);
            var post = fun.reduceRight(function(p, c, i) {
                return _switchCase(discriminant, c.test, consequents[preCases.length + 1 + i], p);
            }, defaultBehavior, postCases);
            
            return statement.bindExpression(
                fun.reduceRight(function(p, c, i) {
                    return _switchCase(discriminant, c.test, consequents[i], p);
                }, post, preCases),
                function(result) {
                    return (result instanceof completion.BreakCompletion && !result.label ?
                        statement.completeNormal(result.value) : 
                        statement.just(result))
                });
        });
};

/* Iteration Statement Semantics
 ******************************************************************************/
var _iter = function(test, pre, body, post) {
    post = statement.liftExpression(post);
    var iter = ifStatement(test,
        statement.next(
            statement.liftExpression(pre),
            statement.bind(body, function(x) {
                if (x instanceof completion.AbruptCompletion) {
                    switch (x.type) {
                    case completion.ContinueCompletion.type:
                        return statement.next(
                            post,
                            statementNext(
                                statement.completeNormal(x.value),
                                iter));
                    
                    case completion.BreakCompletion.type:
                        return statement.completeNormal(x.value);
                    
                    default:
                        return statement.just(x);
                    }
                }
                return statement.next(
                    post,
                    statementNext(statement.just(x), iter));
            })),
        statement.empty);
     return iter;
};

/**
 * While statement
 * 
 * @param test Computation resulting in value that stops iteration if falsy.
 * @param body Statement-like computation loop body.
 */
var whileStatement = function(test, body) {
    return _iter(
        test,
        compute.empty,
        body,
        compute.empty);
};

/**
 * Do while statement
 * 
 * @param body Loop body statement.
 * @param test Expression giving value that stops iteration if falsy.
 */
var doWhileStatement = function(body, test) {
    return statement.bind(body, function(x) {
        if (x instanceof completion.AbruptCompletion) {
            switch (x.type) {
            case completion.BreakCompletion.type:       return completion.completeNormal(x.value);
            case completion.ContinueCompletion.type:    break;
            default:                                    return statement.just(x);
            }
        }
        return _iter(test, compute.empty, body, compute.empty);
    });
};

/**
 * For statement
 * 
 * @param init Computation executed before any iterations.
 * @param test Computation giving condition that must be satisfied to enter the
 *    loop.
 * @param update Computation executed after each iteration.
 * @param body Statement-like computation for the body of the loop.
 */
var forStatement = function(init, test, update, body) {
    return statement.next(
        statement.liftExpression(init),
        _iter(
            test,
            compute.empty,
            body,
            update));
};

/**
 * For-in statement
 * 
 * @param lhs Expression giving reference to bind on each iteration.
 * @param rhs Expression giving object to enumerate.
 * @param body Loop body statement.
 * 
 * @TODO: using an internal reference to track iteration state is pretty ugly.
 */
var forInStatement = function(lhs, rhs, body) {
    return statement.bindExpression(
        internal_reference.dereferenceFrom(rhs, function(x) {
            return (value.isNull(x) || value.isUndefined(x) ?
                compute.just([]) :
                compute.bind(
                    type_conversion.toObject(x),
                    object.getEnumerableProperties));
        }),
        function(props) {
            return statement.bindExpression(iref.create(0), function(ref) { 
                return _iter(
                    internal_reference.dereference(ref, function(x) { return boolean.create(x < props.length); }),
                    compute.binary(
                        lhs,
                        internal_reference.dereference(ref, function(i) { return string.create(props[i]); }),
                        internal_reference.setValue),
                    body,
                    internal_reference.modifyValue(ref, function(x) { return x + 1; }));
            });
        });
};

/**
 * For-in statement with a var declarator on the left hand side.
 * 
 * @param {String} id Name of variable to bind on each iteration.
 * @param rhs Expression giving object to enumerate.
 * @param body Loop body statement.
 */
var forVarInStatement = function(id, rhs, body) {
    return statement.bindExpression(
        environment_reference.create(id),
        function(ref) {
            return forInStatement(
                compute.just(ref),
                rhs,
                body);
    });
};

/* Error Handling Statements
 ******************************************************************************/
/**
 * Try-catch-finally statement
 * 
 * @param body Statement executed. Errors during execution are trapped and handled.
 * @param {string} handlerId Name of to bind error value to in the catch block.
 * @param handler Statement-like computation executed if 'body' fails.
 * @param finalizer Statement-like computation executed at the end of the statement,
 *    regardless of if an error occurred.
 */
var tryCatchFinallyStatement = (function(){
    var mergeCompletion = function(a, b) {
        return compute.binary(a, b, function(x, y) {
            if (x instanceof completion.AbruptCompletion)
                return statement.just(y instanceof completion.AbruptCompletion ? y : x);
            return statement.just(y.value ? y : x);
        });
    };
    
    return function(body, handlerId, handler, finalizer) {
        var catchBody = function(value, previous) {
            return environmentBlock(
                statement.sequence(
                    statement.liftExpression(
                        compute.next(
                            compute.bind(
                                compute.bind(environment.getEnvironment, environment.createDeclativeEnvironment),
                                environment.setEnvironment),
                            environment.putMutableBinding(handlerId, value))),
                    statementNext(
                        (previous ? statement.just(previous) : statement.empty),
                        handler)));
        };
        
        return mergeCompletion(
            statement.bind(
                statement.between(error.push(), error.pop,
                    body),
                function(result) {
                    return (result instanceof completion.ErrorCompletion ?
                        catchBody(result.value, result.previous) :
                        statement.just(result));
                }),
                finalizer);
    };
}());

/**
 * Try-catch statement
 * 
 * No finally block.
 */
var tryCatchStatement = fun.placeholder(tryCatchFinallyStatement,
    fun._,
    fun._,
    fun._,
    statement.empty);

/**
 * Try-finally statement
 * 
 * No catch block.
 */
var tryFinallyStatement = fun.placeholder(tryCatchFinallyStatement,
    fun._,
    null,
    statement.empty);

/* Export
 ******************************************************************************/
return {
    'statementNext': statementNext,
    'statementList': statementList,
    
// Base Statements
    'emptyStatement': emptyStatement,
    'expressionStatement': expressionStatement,
    'blockStatement': blockStatement,
    'debuggerStatement': debuggerStatement,
    'withStatement': withStatement,
    
// Declaration
    'declarationStatement': declarationStatement,

// Completion Statements
    'returnStatement': returnStatement,
    'throwStatement': throwStatement,
    'breakStatement': breakStatement,
    'continueStatement': continueStatement,
    
// Flow Control Statements
    'ifStatement': ifStatement,
    'switchStatement': switchStatement,
    
// Iteration Statements
    'doWhileStatement': doWhileStatement,
    'whileStatement': whileStatement,
    'forStatement': forStatement,
    'forInStatement': forInStatement,
    'forVarInStatement': forVarInStatement,

// Error Handling Statements
    'tryCatchFinallyStatement': tryCatchFinallyStatement,
    'tryCatchStatement': tryCatchStatement,
    'tryFinallyStatement': tryFinallyStatement
};

});