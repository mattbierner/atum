/**
 * @fileOverview ECMAScript 5.1 statement semantics.
 */
define(['atum/compute',
        'atum/reference',
        'atum/completion',
        'atum/context/environment',
        'atum/operations/environment',
        'atum/operations/type_conversion',
        'atum/operations/completion',
        'atum/operations/internal_reference',
        'atum/semantics/expression'],
function(compute,
        reference,
        completion,
        environment,
        environment_semantics,
        type_conversion,
        completion_semantics,
        internal_reference,
        expression){
//"use strict";

/* 
 ******************************************************************************/
var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);
var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);


/* Statement Semantics
 ******************************************************************************/
var attempt = function(p) {
    return compute.bindError(p, function(e) {
        return compute.always(new completion.ThrowCompletion(e));
    });
};

var statementNext = function(p, q) {
    return compute.bind(p, function(x) {
        if (x instanceof completion.AbruptCompletion) {
            return compute.always(x);
        }
        return compute.bind(q, function(y) {
            if (y instanceof completion.Completion) {
                switch (y.type) {
                case completion.NormalCompletion.type:
                    return completion_semantics.createNormalCompletion(
                        compute.always(y.value === null ? x.value : y.value));
                 case completion.BreakCompletion.type:
                    return completion_semantics.createBreakCompletion(
                        y.target,
                        compute.always(y.value === null ? x.value : y.value));
                 case completion.ContinueCompletion.type:
                    return completion_semantics.createContinueCompletion(
                        y.target,
                        compute.always(y.value === null ? x.value : y.value));
                 case completion.ThrowCompletion.type:
                     return compute.always(new completion.ThrowCompletion(y.value, x));
                }
            }
            return compute.always(y);
        });
    });
};

/**
 * 
 */
var emptyStatement = function() {
    return completion_semantics.createNormalCompletion(compute.empty);
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
 * Semantics for an expression statement.
 * 
 * @param expresssion
 */
var expressionStatement = function(expr) {
    return attempt(completion_semantics.createNormalCompletion(internal_reference.getValue(expr)));
};

/**
 * Semantics for an if statement
 */
var ifStatement = function(test, consequent, alternate) {
    return attempt(compute.bind(
        type_conversion.toBoolean(internal_reference.getValue(test)),
        function(x) {
            return (x.value ? consequent : alternate);
        }));
};

/**
 * Semantics for a return statement.
 */
var returnStatement = function(argument) {
    return compute.Computation('Return Statement',
        attempt(completion_semantics.createReturnCompletion(internal_reference.getValue(argument))));
};

/**
 * Semantics for a throw statement.
 */
var throwStatement = function(argument) {
    return compute.Computation('Throw Statement',
        attempt(compute.bind(
            internal_reference.getValue(argument),
            function(e) {
                return compute.always(new completion.ThrowCompletion(e));
            })));
};

/**
 * Semantics for a break statement.
 * 
 * @param {String} [label]
 */
var breakStatement = function(label) {
    return completion_semantics.createBreakCompletion(label, null);
};

/**
 * Semantics for a continue statement.
 * 
 * @param {String} [label]
 */
var continueStatement = function(label) {
    return completion_semantics.createContinueCompletion(label, null);
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
            var discriminant = compute.always(x);
            var post = postCases.reduceRight(function(p, c, i) {
                return _switchCase(discriminant, c.test, consequents[preCases.length + 1 + i], p);
            }, defaultBehavior);
            
            return compute.bind(
                preCases.reduceRight(function(p, c, i) {
                    return _switchCase(discriminant, c.test, consequents[i], p);
                }, post),
                function(result) {
                    return compute.always(result instanceof completion.BreakCompletion && !result.label ?
                        result.value : 
                        result)
                });
        });
};

/* Iteration Statement Semantics
 ******************************************************************************/
/**
 * 
 */
var forStatement = function(init, test, update, body) {
    var iter = ifStatement(test,
        compute.bind(body, function(x) {
            if (x instanceof completion.AbruptCompletion) {
                switch (x.type) {
                case completion.ContinueCompletion.type:
                    return compute.next(
                        update,
                        statementNext(
                            completion_semantics.createNormalCompletion(compute.always(x.value)),
                            iter));
                case completion.BreakCompletion.type:
                    return completion_semantics.createNormalCompletion(compute.always(x.value));
                default:
                    return compute.always(x);
                }
            }
            return compute.next(
                update,
                statementNext(compute.always(x), iter));
        }),
        emptyStatement());
    return compute.next(init, iter);
};

/**
 * 
 */
var whileStatement = function(test, body) {
    return forStatement(compute.empty, test, compute.empty, body);
};

/**
 * 
 */
var doWhileStatement = function(body, test) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.AbruptCompletion) {
            switch (x.type) {
            case completion.BreakCompletion.type:       return compute.always(x.value);
            case completion.ContinueCompletion.type:    break;
            default:                                    return compute.always(x);
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
 * @TODO Handle case there try throws but catch body empty yields normal completion
 *   from before the throw:
 *    try {
 *       10;
 *       throw 100;
 *    } catch (e) {}
 *   
 *   should yield 10
 */
var tryCatchFinallyStatement = (function(){
    var mergeCompletion = function(a, b) {
        return compute.bind(a, function(x) {
            return compute.bind(b, function(y) {
                return compute.always(!(y instanceof completion.AbruptCompletion) ? x : y);
            });
        });
    };
    
    return function(body, handlerId, handler, finalizer) {
        return mergeCompletion(
            compute.bind(body, function(error) {
                if (error instanceof completion.ErrorCompletion) {
                    return compute.bind(environment_semantics.getEnvironment(), function(env){
                        return compute.bind(
                            environment_semantics.createEnvironment(new environment.DeclarativeLexicalEnvironment(env)),
                            function(e) {
                                return environment_semantics.withEnvironment(e,
                                    compute.next(
                                        environment_semantics.putMutableBinding(handlerId, false, compute.always(error.value)),
                                        statementNext((error.previous ? compute.always(error.previous) : emptyStatement()), handler)));
                            });
                        });
                }
                return compute.always(error);
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
    'ifStatement': ifStatement,
    'emptyStatement': emptyStatement,
    'expressionStatement': expressionStatement,
    'returnStatement': returnStatement,
    'throwStatement': throwStatement,
    'breakStatement': breakStatement,
    'continueStatement': continueStatement,
    'switchStatement': switchStatement,
    
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