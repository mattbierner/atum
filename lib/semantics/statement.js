/**
 * @fileOverview ECMAScript 5.1 statement semantics.
 * 
 * Statements behave differently from other computations, they always succeed
 * with a completion. Statement computations must never fail, failures are
 * wrapped in a failure completion and returned as a success.
 */
define(['atum/compute',
        'atum/reference',
        'atum/completion',
        'atum/context/environment',
        'atum/debug/operations',
        'atum/operations/boolean',
        'atum/operations/environment',
        'atum/operations/type_conversion',
        'atum/operations/completion',
        'atum/operations/internal_reference',
        'atum/semantics/expression'],
function(compute,
        reference,
        completion,
        environment,
        debug_operations,
        boolean,
        environment_semantics,
        type_conversion,
        completion_semantics,
        internal_reference,
        expression){
//"use strict";

var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);
var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);

/* Statement Semantics
 ******************************************************************************/
/**
 * Takes a normal computation that may error and correctly wraps error results
 * in a error completion.
 * @param p Computation
 */
var attempt = function(p) {
    return compute.bindError(p, function(e) {
        return completion_semantics.completeThrow(compute.just(e));
    });
};

var statementNext = function(p, q) {
    return compute.bind(p, function(x) {
        if (x instanceof completion.AbruptCompletion)
            return compute.just(x);
        
        return compute.bind(q, function(y) {
            if (y instanceof completion.Completion) {
                switch (y.type) {
                case completion.NormalCompletion.type:
                    return completion_semantics.completeNormal(
                        compute.just(y.value === null ? x.value : y.value));
                 case completion.BreakCompletion.type:
                    return completion_semantics.completeBreak(
                        y.target,
                        compute.just(y.value === null ? x.value : y.value));
                 case completion.ContinueCompletion.type:
                    return completion_semantics.completeContinue(
                        y.target,
                        compute.just(y.value === null ? x.value : y.value));
                 case completion.ThrowCompletion.type:
                     return compute.just(new completion.ThrowCompletion(y.value, x));
                }
            }
            return compute.just(y);
        });
    });
};

/**
 * 
 */
var emptyStatement = function() {
    return completion_semantics.completeNormal(compute.empty);
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
var statementList = function(statements) {
    return (statements.length ?
        reduce(statements, statementNext) :
        emptyStatement());
};


/**
 * 
 */
var blockStatement = statementList;

/**
 * Semantics for an expression statement.
 * 
 * @param expresssion
 */
var expressionStatement = function(expr) {
    return debug_operations.debuggable(
        attempt(
            completion_semantics.completeNormal(
                internal_reference.getValue(expr))));
};

/**
 * If statement semantics.
 * 
 * @param test Computation of value to branch on.
 * @param consequent Statement-like computation evaluated if 'test' is a truthy
 *    value.
 * @param alternate Statement-like computation evaluated if 'test' is a falsy
 *    value.
 */
var ifStatement = function(test, consequent, alternate) {
    return attempt(compute.branch(
        debug_operations.debuggable(
            boolean.isTrue(
                type_conversion.toBoolean(
                    internal_reference.getValue(test)))),
        consequent,
        alternate));
};

/**
 * Return statement semantics.
 * 
 * @param argument Computation of value to return.
 */
var returnStatement = function(argument) {
    return compute.Computation('Return Statement',
        attempt(completion_semantics.completeReturn(
            debug_operations.debuggable(
                internal_reference.getValue(argument)))));
};

/**
 * Throw statement semantics.
 * 
 * @param argument Computation of value to throw.
 */
var throwStatement = function(argument) {
    return compute.Computation('Throw Statement',
        attempt(completion_semantics.completeThrow(
             debug_operations.debuggable(
                 internal_reference.getValue(argument)))));
};

/**
 * Break statement semantics.
 * 
 * @param {String} [label]
 */
var breakStatement = function(label) {
    return debug_operations.debuggable(
        completion_semantics.completeBreak(label, null));
};

/**
 * Continue statement semantics.
 * 
 * @param {String} [label]
 */
var continueStatement = function(label) {
    return debug_operations.debuggable(
        completion_semantics.completeContinue(label, null));
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
    return ifStatement(expression.strictEqualOperator(test, discriminant), consequent, alternate);
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
 */
var switchStatement = function(discriminant, preCases, defaultCase, postCases) {
    var behaviors = [].concat(
        preCases.map(function(x) { return x.consequent; }),
        [defaultCase.consequent],
        postCases.map(function(x) { return x.consequent; }));
    
    var consequents = behaviors.reduceRight(function(p, c) {
        return [statementList([c].concat(p))].concat(p);
    }, []);
    
    var defaultBehavior = consequents[preCases.length];
    
    return compute.bind(
        discriminant,
        function(x) {
            var discriminant = compute.just(x);
            var post = postCases.reduceRight(function(p, c, i) {
                return _switchCase(discriminant, c.test, consequents[preCases.length + 1 + i], p);
            }, defaultBehavior);
            
            return compute.bind(
                preCases.reduceRight(function(p, c, i) {
                    return _switchCase(discriminant, c.test, consequents[i], p);
                }, post),
                function(result) {
                    return compute.just(result instanceof completion.BreakCompletion && !result.label ?
                        result.value : 
                        result)
                });
        });
};

/**
 * With statement semantics.
 */
var withStatement = function(expr, body) {
    return compute.bind(
        type_conversion.toObject(internal_reference.getValue(expr)),
        function(obj) {
            return compute.bind(environment_semantics.getEnvironment(), function(env) {
                return environment_semantics.withEnvironment(
                    environment_semantics.createObjectEnvironment(env, obj),
                    body);
            });
        });
};

/* Iteration Statement Semantics
 ******************************************************************************/
/**
 * For statement semantics.
 * 
 * @param init Computation executed before any iterations.
 * @param test Computation giving condition that must be satisfied to enter the
 *    loop.
 * @param update Computation executed after each iteration.
 * @param body Statement-like computation for the body of the loop.
 */
var forStatement = function(init, test, update, body) {
    init = debug_operations.debuggable(init);
    update = debug_operations.debuggable(update);

    var iter = ifStatement(test,
        compute.bind(body, function(x) {
            if (x instanceof completion.AbruptCompletion) {
                switch (x.type) {
                case completion.ContinueCompletion.type:
                    return attempt(compute.next(
                        update,
                        statementNext(
                            completion_semantics.completeNormal(compute.just(x.value)),
                            iter)));
                case completion.BreakCompletion.type:
                    return completion_semantics.completeNormal(compute.just(x.value));
                default:
                    return compute.just(x);
                }
            }
            return attempt(compute.next(
                update,
                statementNext(compute.just(x), iter)));
        }),
        emptyStatement());
    
    return attempt(compute.next(init, iter));
};

/**
 * While statement semantics.
 * 
 * @param test Computation resulting in value that stops iteration if falsy.
 * @param body Statement-like computation loop body.
 */
var whileStatement = function(test, body) {
    return forStatement(compute.empty, test, compute.empty, body);
};

/**
 * Do while statement semantics.
 * 
 * @param body Statement-like computation loop body.
 * @param test Computation resulting in value that stops iteration if falsy.
 */
var doWhileStatement = function(body, test) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.AbruptCompletion) {
            switch (x.type) {
            case completion.BreakCompletion.type:       return completeNormal(compute.just(x.value));
            case completion.ContinueCompletion.type:    break;
            default:                                    return compute.just(x);
            }
        }
        return whileStatement(test, body);
    })
};

/**
 * @TODO
 */
var forInStatement;


/* 
 ******************************************************************************/
/**
 * Try-catch-finally statement semantics.
 * 
 * @param body Statement-like computation to execute and handle errors from.
 * @param {string} handler Name of to bind error value to in the catch block.
 * @param handler Statement-like computation executed if 'body' fails.
 * @param finalizer Statement-like computation executed at the end of the statement,
 *    regardless of if an error occurred.
 */
var tryCatchFinallyStatement = (function(){
    var mergeCompletion = function(a, b) {
        return compute.binary(a, b, function(x, y) {
            return compute.just(y instanceof completion.AbruptCompletion ? y : x);
        });
    };
    
    return function(body, handlerId, handler, finalizer) {
        var catchBody = function(value, previous) {
            return environment_semantics.withEnvironment(
                environment_semantics.createDeclativeEnvironment(environment_semantics.getEnvironment()),
                compute.next(
                    environment_semantics.putMutableBinding(handlerId, compute.just(value)),
                    statementNext((previous ? compute.just(previous) : emptyStatement()), handler)));
        };
        
        return mergeCompletion(
            compute.bind(body, function(result) {
                return (result instanceof completion.ErrorCompletion ?
                    catchBody(result.value, result.previous) :
                    compute.just(result));
            }),
            finalizer);
    };
}());

var tryCatchStatement = function(body, handlerId, handler) {
    return tryCatchFinallyStatement(body, handlerId, handler, emptyStatement());
};

var tryFinallyStatement = function(body, finalizer) {
    return tryCatchFinallyStatement(body, null, emptyStatement(), finalizer);
};


/* Export
 ******************************************************************************/
return {
    'statementList': statementList,
    
    'blockStatement': blockStatement,
    'ifStatement': ifStatement,
    'emptyStatement': emptyStatement,
    'expressionStatement': expressionStatement,
    'returnStatement': returnStatement,
    'throwStatement': throwStatement,
    'breakStatement': breakStatement,
    'continueStatement': continueStatement,
    'switchStatement': switchStatement,
    'withStatement': withStatement,
    
// Iteration Statement semantics
    'doWhileStatement': doWhileStatement,
    'whileStatement': whileStatement,
    'forStatement': forStatement,
    'forInStatement': forInStatement,
    
//
    'tryCatchFinallyStatement': tryCatchFinallyStatement,
    'tryCatchStatement': tryCatchStatement,
    'tryFinallyStatement': tryFinallyStatement
};

});