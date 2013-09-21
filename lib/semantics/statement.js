/**
 * @fileOverview ECMAScript 5.1 statement semantics.
 * 
 * Statements behave differently from other computations, they always succeed
 * with a completion. Statement computations must never fail, failures are
 * wrapped in a failure completion and returned as a success.
 */
define(['atum/compute',
        'atum/completion',
        'atum/environment_reference',
        'atum/debug/operations',
        'atum/operations/boolean',
        'atum/operations/complete',
        'atum/operations/environment',
        'atum/operations/type_conversion',
        'atum/operations/internal_reference',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/semantics/expression',
        'atum/value/value'],
function(compute,
        completion,
        environment_reference,
        debug_operations,
        boolean,
        complete,
        environment,
        type_conversion,
        internal_reference,
        object,
        string,
        value_reference,
        expression,
        value){
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
    return compute.bindError(p, complete.completeThrow);
};

var statementNext = function(p, q) {
    return compute.bind(p, function(x) {
        if (x instanceof completion.AbruptCompletion)
            return compute.just(x);
        
        return compute.bind(q, function(y) {
            if (y instanceof completion.Completion) {
                switch (y.type) {
                case completion.NormalCompletion.type:
                    return complete.completeNormal(
                        (y.value === null ? x.value : y.value));
                
                case completion.BreakCompletion.type:
                    return complete.completeBreak(
                        y.target,
                        (y.value === null ? x.value : y.value));
                
                 case completion.ContinueCompletion.type:
                    return complete.completeContinue(
                        y.target,
                        (y.value === null ? x.value : y.value));
                
                 case completion.ThrowCompletion.type:
                     return complete.completeThrow(y.value, x);
                }
            }
            return compute.just(y);
        });
    });
};

/**
 * Empty statement.
 * 
 * Completes normally without a value.
 */
var emptyStatement = complete.completeNormal();

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
        emptyStatement);
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
            complete.completeNormalFrom(
                internal_reference.getValue(expr))));
};

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
    return attempt(compute.branch(
        debug_operations.debuggable(
            boolean.isTrue(
                compute.bind(internal_reference.getValue(test), type_conversion.toBoolean))),
        consequent,
        alternate));
};

/**
 * Return statement
 * 
 * @param argument Computation of value to return.
 */
var returnStatement = function(argument) {
    return compute.Computation('Return Statement',
        attempt(complete.completeReturnFrom(
            debug_operations.debuggable(
                internal_reference.getValue(argument)))));
};

/**
 * Throw statement
 * 
 * @param argument Computation of value to throw.
 */
var throwStatement = function(argument) {
    return compute.Computation('Throw Statement',
        attempt(complete.completeThrowFrom(
             debug_operations.debuggable(
                 internal_reference.getValue(argument)))));
};

/**
 * Break statement
 * 
 * @param {String} [label]
 */
var breakStatement = function(label) {
    return debug_operations.debuggable(
        complete.completeBreak(label));
};

/**
 * Continue statement
 * 
 * @param {String} [label]
 */
var continueStatement = function(label) {
    return debug_operations.debuggable(
        complete.completeContinue(label));
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
    return ifStatement(expression.strictEqualOperator(test, discriminant),
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
 * With statement
 */
var withStatement = function(expr, body) {
    return compute.bind(
        compute.bind(internal_reference.getValue(expr), type_conversion.toObject),
        function(obj) {
            return compute.bind(environment.getEnvironment(), function(env) {
                return environment.withEnvironment(
                    environment.createObjectEnvironment(env, obj),
                    body);
            });
        });
};

/* Iteration Statement Semantics
 ******************************************************************************/
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
                            complete.completeNormal(x.value),
                            iter)));
                
                case completion.BreakCompletion.type:
                    return complete.completeNormal(x.value);
                
                default:
                    return compute.just(x);
                }
            }
            return attempt(compute.next(
                update,
                statementNext(compute.just(x), iter)));
        }),
        emptyStatement);
    
    return attempt(compute.next(init, iter));
};

/**
 * While statement
 * 
 * @param test Computation resulting in value that stops iteration if falsy.
 * @param body Statement-like computation loop body.
 */
var whileStatement = function(test, body) {
    return forStatement(compute.empty, test, compute.empty, body);
};

/**
 * Do while statement
 * 
 * @param body Statement-like computation loop body.
 * @param test Computation resulting in value that stops iteration if falsy.
 */
var doWhileStatement = function(body, test) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.AbruptCompletion) {
            switch (x.type) {
            case completion.BreakCompletion.type:       return completion.completeNormal(x.value);
            case completion.ContinueCompletion.type:    break;
            default:                                    return compute.just(x);
            }
        }
        return whileStatement(test, body);
    });
};

/**
 */
var forInStatement = function(lhs, rhs, body) {
    return compute.bind(attempt(internal_reference.getValue(rhs)), function(x) {
        if (value.isNull(x) || value.isUndefined(x))
            return complete.completeNormal();
        return value_reference.dereferenceFrom(
            type_conversion.toObject(x),
            function(obj, ref) {
                var props = obj.getEnumerableProperties();
                return props.reduceRight(function(p, c) {
                    return statementNext(
                        statementNext(attempt(internal_reference.setValue(lhs, string.create(c))), body),
                        p);
                }, complete.completeNormal());
        });
    });
};

/**
 */
var forVarInStatement = function(id, rhs, body) {
    return compute.bind(environment_reference.create(id), function(ref) {
        return forInStatement(
            compute.just(ref),
            rhs,
            body);
    });
};


/* 
 ******************************************************************************/
/**
 * Try-catch-finally statement
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
            if (x instanceof completion.AbruptCompletion)
                return compute.just(y instanceof completion.AbruptCompletion ? y : x);
            return compute.just(y.value ? y : x);
        });
    };
    
    return function(body, handlerId, handler, finalizer) {
        var catchBody = function(value, previous) {
            return environment.withEnvironment(
                compute.bind(environment.getEnvironment(), environment.createDeclativeEnvironment),
                compute.next(
                    environment.putMutableBinding(handlerId, compute.just(value)),
                    statementNext((previous ? compute.just(previous) : emptyStatement), handler)));
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
    return tryCatchFinallyStatement(body, handlerId, handler, emptyStatement);
};

var tryFinallyStatement = function(body, finalizer) {
    return tryCatchFinallyStatement(body, null, emptyStatement, finalizer);
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
    'forVarInStatement': forVarInStatement,
//
    'tryCatchFinallyStatement': tryCatchFinallyStatement,
    'tryCatchStatement': tryCatchStatement,
    'tryFinallyStatement': tryFinallyStatement
};

});