/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/reference',
        'atum/completion',
        'atum/iref',
        'atum/context/environment', 'atum/context/execution_context',
        'atum/value/value', 'atum/value/func', 'atum/value/object',
        'atum/semantics/environment',
        'atum/semantics/number', 'atum/semantics/string', 'atum/semantics/boolean', 'atum/semantics/object',
        'atum/semantics/nil', 'atum/semantics/undef',
        'atum/semantics/type_conversion', 'atum/semantics/compare',
        'atum/semantics/reference',
        'atum/semantics/value_reference',
        'atum/semantics/completion',
        'atum/builtin/object',
        'atum/value/type', 'atum/value/undef',
        'atum/semantics/execution_context'],
function(compute,
        reference,
        completion,
        iref,
        environment, execution_context,
        value, func, object_value,
        environment_semantics,
        number, string, boolean, object,
        nil, undef_semantics,
        type_conversion, compare,
        reference_semantics,
        value_reference,
        completion_semantics,
        object_builtin,
        type, undef,
        execution_context_semantics){
//"use strict";

/* 
 ******************************************************************************/
var reduce = Function.prototype.call.bind(Array.prototype.reduce);
var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);


/* Program and Function Semantics
 ******************************************************************************/
/**
 * Semantics for the body of a program or function.
 * 
 * Evaluates statements in order until a completion is found or no more statements
 * are left.
 * 
 * @param statements Array of statement computations to evaluate in order.
 * @param [declarations] Array of declarations to evaluate before evaluating any
 *    statements
 */
var sourceElements = function(statements, declarations) {
    return (declarations ?
        compute.next(
            compute.sequence.apply(undefined, declarations),
            statementList(statements)) :
        statementList(statements));
};

/**
 * 
 */
var functionExpression = function(id, params, body) {
    var code = compute.bind(body, function(x) {
        return (x instanceof completion.ReturnCompletion ? 
            compute.always(x.value) :
            undef_semantics.create());
    });
    
    return compute.Computation('Function',
        compute.bind(
            compute.getContext(),
            function(ctx) {
                return compute.always(new func.Function(ctx.lexicalEnvironment, id, params, code, false));
            }));
};

/* Statement Semantics
 ******************************************************************************/
var statementNext = function(p, q) {
    return compute.bind(p, function(x) {
        if (x instanceof completion.AbruptCompletion) {
            return compute.always(x);
        }
        return compute.bind(q, function(y) {
            if (y instanceof completion.Completion) {
                switch (y.type) {
                case 'normal':
                    return completion_semantics.createNormalCompletion(
                        compute.always(y.value === null ? x.value : y.value));
                 case 'break':
                    return completion_semantics.createBreakCompletion(
                        y.target,
                        compute.always(y.value === null ? x.value : y.value));
                 case 'continue':
                    return completion_semantics.createContinueCompletion(
                        y.target,
                        compute.always(y.value === null ? x.value : y.value));
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
    return completion_semantics.createNormalCompletion(compute.always(null));
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
    return completion_semantics.createNormalCompletion(reference_semantics.getValue(expr));
};

/**
 * Semantics for an if statement
 */
var ifStatement = function(test, consequent, alternate) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(test)),
        function(x) {
            return (x.value ? consequent : alternate);
        });
};

/**
 * Semantics for a return statement.
 */
var returnStatement = function(argument) {
    return compute.Computation('Return Statement',
        completion_semantics.createReturnCompletion(reference_semantics.getValue(argument)));
};

/**
 * Semantics for a throw statement.
 */
var throwStatement = function(argument) {
    return compute.Computation('Throw Statement',
        compute.bind(
            reference_semantics.getValue(argument),
            function(x){ return compute.never(x);}));
};

/**
 * Semantics for a break statement.
 * 
 * @param {String} [label]
 */
var breakStatement = function(label) {
    return completion_semantics.createBreakCompletion(label);
};

/**
 * Semantics for a continue statement.
 * 
 * @param {String} [label]
 */
var continueStatement = function(label) {
    return completion_semantics.createContinueCompletion(label);
};

/**
 * Semantics for a single switch case clause.
 * 
 * Switch behavior, such as fallthough, is handled in 'switchStatement'.
 * 
 * @param discriminant Computation the switch is discriminating on.
 * @param test Computation to test the 'discriminate' against.
 * @param consequent Compuatation to evaluate if 'discriminant' and 'test' results
 *    in true.
 * @param alternate Compuatation to evaluate if 'discriminant' and 'test' results
 *    in false.
 */
var _switchCase = function(discriminant, test, consequent, alternate) {
    return compute.bind(
        strictEqualOperator(test, discriminant),
        function(found) {
            return (found.value ? consequent : alternate);
        });
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
                case 'continue':
                    return compute.next(
                        update,
                        statementNext(
                            completion_semantics.createNormalCompletion(compute.always(x.value)),
                            iter));
                case 'break':
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
    return forStatement(compute.always(null), test, compute.always(null), body);
};

/**
 * 
 */
var doWhileStatement = function(body, test) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.Completion) {
            switch (x.type) {
            case 'break':       return compute.always(x.value);
            case 'continue':    break;
            default:            return compute.always(x);
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
var tryCatchFinallyStatement = function(body, handlerId, handler, finalizer) {
    return compute.then(
        compute.bindError(body, function(error) {
            return compute.next(
                environment_semantics.pushEnvironment(function(env) {
                    return new environment.DeclarativeLexicalEnvironment(env);
                }),
                compute.next(
                    environment_semantics.putMutableBinding(handlerId, false, compute.always(error)),
                    compute.then(handler,
                        environment_semantics.popEnvironment())));
            }),
        finalizer);
};

var tryCatchStatement = function(body, handlerId, handler) {
    return tryCatchFinallyStatement(body, handlerId, handler, emptyStatement());
};

var tryFinallyStatement = function(body, finalizer) {
    return tryCatchFinallyStatement(body, null, emptyStatement(), finalizer);
};


/* Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var addOperator = function(left, right) {
    return compute.binds(
        compute.sequence(
            type_conversion.toPrimitive(reference_semantics.getValue(left)),
            type_conversion.toPrimitive(reference_semantics.getValue(right))),
        function(lprim, rprim) {
            var l = compute.always(lprim),
                r = compute.always(rprim);
            return (value.type(lprim) === "string" || value.type(rprim) === "string" ?
                string.concat(
                     type_conversion.toString(l),
                     type_conversion.toString(r)) :
                number.add(
                    type_conversion.toNumber(l),
                    type_conversion.toNumber(r)));
        });
};

/**
 * 
 */
var subtractOperator = function(left, right) {
    return number.subtract(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var multiplyOperator = function(left, right) {
    return number.multiply(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var divideOperator = function(left, right) {
    return number.divide(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var remainderOperator = function(left, right) {
    return number.remainder(
        type_conversion.toNumber(reference_semantics.getValue(left)),
        type_conversion.toNumber(reference_semantics.getValue(right)));
};

/**
 * 
 */
var leftShiftOperator = function(left, right) {
    return number.leftShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var signedRightShiftOperator = function(left, right) {
    return number.signedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var unsignedRightShiftOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toUint32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseAndOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseXorOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/**
 * 
 */
var bitwiseOrOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(reference_semantics.getValue(left)),
        type_conversion.toInt32(reference_semantics.getValue(right)));
};

/* Equality Relational Operators
 ******************************************************************************/
/**
 * Semantics for an equal operator.
 * 
 * Compares 'left' value to 'right' value.
 */
var equalOperator = function(left, right) {
    return compare.equal(
        reference_semantics.getValue(left),
        reference_semantics.getValue(right));
};

/**
 * Semantics for a strict equal operator.
 * 
 * Does a strict comparison of 'left' value to 'right' value.
 */
var strictEqualOperator = function(left, right) {
    return compare.strictEqual(
        reference_semantics.getValue(left),
        reference_semantics.getValue(right));
};

/**
 * Semantics for a not equal operator.
 */
var notEqualOperator = function(left, right) {
    return logicalNotOperator(equalOperator(left, right));
};

/**
 * Semantics for a strict not equal operator.
 */
var strictNotEqualOperator = function(left, right) {
    return logicalNotOperator(strictEqualOperator(left, right));
};


/* Numeric Binary Relational Operators
 * 
 * @TODO Should we return undefined values when NaN is used?
 ******************************************************************************/
var _relationalOperator = function(op) {
    return function(left, right) {
        return op(
            type_conversion.toNumber(reference_semantics.getValue(left)),
            type_conversion.toNumber(reference_semantics.getValue(right)));
    };
};

/**
 *
 */
var ltOperator = _relationalOperator(number.lt);

/**
 * 
 */
var lteOperator = _relationalOperator(number.lte);

/**
 * 
 */
var gtOperator = _relationalOperator(number.gt);

/**
 * 
 */
var gteOperator = _relationalOperator(number.gte);

var instanceofOperator = function(left, right) {
    return compute.bind(
        reference_semantics.getValue(left),
        function(l) {
            return compute.bind(
                reference_semantics.getValue(right),
                function(r) {
                    return function(ctx, v, ok, err) {
                        if (value.type(r) !== 'object') {
                            return err('Instanceof', ctx);
                        }
                        return ok(value.hasInstance(l), ctx, v);
                    };
                });
        });
};

var inOperator;

/* Unary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var unaryPlusOperator = function(argument) {
    return type_conversion.toNumber(reference_semantics.getValue(argument));
};

/**
 * 
 */
var unaryMinusOperator = function(argument) {
    return number.negate(type_conversion.toNumber(reference_semantics.getValue(argument)));
};

/**
 * 
 */
var logicalNotOperator = function(argument) {
    return boolean.logicalNot(type_conversion.toBoolean(reference_semantics.getValue(argument)));
};

var bitwiseNotOperator = function(argument) {
    return number.bitwiseNot(type_conversion.toInt32(reference_semantics.getValue(argument)));
};

/**
 * 
 */
var voidOperator = function(argument) {
    return compute.next(reference_semantics.getValue(argument),
        undef_semantics.create());
};

/**
 * 
 */
var typeofOperator = function(argument) {
    return compute.bind(argument, function(val) {
        if (val instanceof reference.Reference) {
            return (reference_semantics.isUnresolvableReference(val) ?
                string.create("undefined") :
                typeofOperator(reference_semantics.getValue(val)));
        }
        return string.create(value.type(val));
    });
};

/* Update Operator Semantics
 ******************************************************************************/
var _prefixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof reference.Reference)) {
                return compute.never("ReferenceError");
            }
            return op(arg, type_conversion.toNumber(reference_semantics.getValue(arg)));
        });
    };
};

var _postfixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof reference.Reference)) {
                return compute.never("ReferenceError");
            }
            return compute.bind(
                type_conversion.toNumber(reference_semantics.getValue(arg)),
                function(x) {
                    var ax = compute.always(x);
                    return compute.next(op(arg, ax), ax);
                });
        });
    };
};

var _increment = function(expr, val) {
    return reference_semantics.putValue(
        expr, 
        number.increment(val));
};

var _decrement = function(expr, val) {
    return reference_semantics.putValue(
        expr, 
        number.decrement(val));
};

/**
 * Semantics for a prefix increment operation.
 * 
 * Gets the current value of reference 'arg' as a number and increments bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return New value bound to reference 'arg'.
 */
var prefixIncrement = _prefixUpdate(_increment);

/**
 * Semantics for a postfix increment operation.
 * 
 * Gets the current value of reference 'arg' as a number and increments bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return Old value bound to reference 'arg' as a number.
 */
var postfixIncrement = _postfixUpdate(_increment);

/**
 * Semantics for a prefix decrement operation.
 * 
 * Gets the current value of reference 'arg' as a number and decrements bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return New value bound to reference 'arg'.
 */
var prefixDecrement = _prefixUpdate(_decrement);

/**
 * Semantics for a postfix decrement operation.
 * 
 * Gets the current value of reference 'arg' as a number and decrements bound
 * value of reference 'arg'.
 * 
 * Errors if 'arg' does not return a reference value.
 * 
 * @param arg Computation that returns a reference.
 * 
 * @return Old value bound to reference 'arg' as a number.
 */
var postfixDecrement = _postfixUpdate(_decrement);


/* Logical Binary Operator Semantics
 ******************************************************************************/
/**
 * Semantics for a logical or operation. Shorts when left evaluates to true.
 */
var logicalOr = function(left, right) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(left)),
        function(result) {
            return (result.value ? left : right);
    });
};

/**
 * Semantics for a logical and operation. Shorts when left evaluates to false.
 */
var logicalAnd = function(left, right) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(left)),
        function(result) {
            return (result.value ? right : left);
        });
};

/* 
 ******************************************************************************/
/**
 * Semantics for a call expression.
 * 
 * Either succeeds with calling 'callee' or fails if 'callee' is not callable. 
 * 
 * @param callee Computation resulting in object being called. 
 * @param args Array of zero or more computations that give the arguments to
 *  call 'callee' with.
 */
var callExpression = function(callee, args) {
    return compute.Computation('Call Expression',
        compute.binds(
            compute.sequence(
                callee,
                value_reference.get(reference_semantics.getValue(callee))),
            function(ref, func) {
                return compute.binds(
                    compute.sequence(
                        compute.sequence.apply(undefined, args.map(reference_semantics.getValue)),
                        reference.getBase(ref)),
                    function(args, base) {
                        if (value.type(func) !== 'object' || !value.isCallable(func)) {
                            return compute.never("TypeError");
                        }
                        if (ref instanceof reference.Reference) {
                            return func.call((ref instanceof object.PropertyReference ? base : base.implicitThisValue()), args);
                        } else {
                            return func.call(new undef.Undefined(), args);
                        }
                    });
            }));
};

/**
 * 
 */
var newExpression = function(callee, args) {
    return compute.binds(
        compute.sequence(
            callee,
            value_reference.get(reference_semantics.getValue(callee)),
            compute.sequence.apply(undefined, args.map(reference_semantics.getValue))),
        function(ref, obj, a) {
            return (value.type(obj) === type.OBJECT_TYPE ?
                obj.construct(a) :
                compute.never("Construct err"));
        });
};


/**
 * Semantics for a member expression.
 */
var memberExpression = function(base, property) {
    return compute.Computation('Member Expression',
        compute.binds(
            compute.sequence(
                compute.getContext(),
                base,
                value_reference.get(reference_semantics.getValue(base)),
                type_conversion.toString(reference_semantics.getValue(property))),
            function(ctx, baseRef, baseValue, propertyName) {
                var name = propertyName.value, strict = ctx.strict;
                return compute.always(baseValue instanceof environment.LexicalEnvironment ?
                    new environment_semantics.EnvironmentReference(name, baseRef, strict) :
                    new object.PropertyReference(name, baseRef, strict));
            }));
};

/* 
 ******************************************************************************/
/**
 * Semantics for a conditional Expression.
 */
var conditionalExpression = function(test, consequent, alternate) {
    return compute.Computation('Conditional Expression',
        compute.bind(
            type_conversion.toBoolean(reference_semantics.getValue(test)),
            function(x) {
                return reference_semantics.getValue(x.value ? consequent : alternate);
            }));
};

/**
 * Semantics for a sequence of two or more expressions.
 */
var sequenceExpression = function(expressions) {
    return compute.Computation('Sequence Expression',
        reduce(expressions, function(p, c) {
            return compute.next(p, reference_semantics.getValue(c));
        }));
};

/**
 * 
 */
var thisExpression = function() {
    return compute.Computation('This Expression',
        execution_context_semantics.getThisBinding());
};

/* Object Literal Semantics
 ******************************************************************************/
/**
 * Semantics for creating an object literal.
 * 
 * @param properties Object mapping string key values to property descriptors.
 */
var objectLiteral = function(properties) {
    return Object.keys(properties).reduce(function(p, key) {
        var prop = properties[key];
        return object.defineProperty(p, key, {
            'value': prop.value ? reference_semantics.getValue(prop.value) : null,
            'get': prop.get ? reference_semantics.getValue(prop.get) : null,
            'set': prop.set ? reference_semantics.getValue(prop.set) : null
        });
    }, newExpression(compute.always(object_builtin.ObjectRef), []));
};

var arrayLiteral;

/* Assignment Semantics
 ******************************************************************************/
var _dereference = function(lref) {
    if (lref instanceof reference.Reference &&
        lref.strict &&
        lref.base instanceof e &&
        (lref.name === "eval" || lref.name === "arguments")) {
        return compute.never("Using eval/arguments in strict");
    }
    return compute.always(lref);
};

/**
 * Semantics for simple assignment.
 */
var assignment = function(left, right) {
    return reference_semantics.putValue(
        compute.bind(left, _dereference),
        reference_semantics.getValue(right));
};

/**
 * Semantics for an assignment that modifies a value by modifying its current value.
 */
var compoundAssignment = function(op, left, right) {
    return reference_semantics.putValue(
        compute.bind(left, _dereference),
        op(
            reference_semantics.getValue(left),
            reference_semantics.getValue(right)));
};

/* Declaration Semantics
 ******************************************************************************/
/**
 * Semantics for a variable declaration.
 * 
 * @param {Array} declarations One or more computations for declaring a variable.
 */
var variableDeclaration = function(declarations) {
    return reduce(declarations, compute.next);
};

/**
 * Semantics for a single variable declarator.
 * 
 * @parma {string} id Identifier to bind to value.
 * @param [init] Computation that returns initial value of bound varaible.
 */
var variableDeclarator = function(id, init) {
    if (init === undefined) {
        init = undef_semantics.create();
    }
    return compute.bind(
        compute.getContext(),
        function(ctx) {
            return environment_semantics.putMutableBinding(id, ctx.strict, reference_semantics.getValue(init));
        });
};

/**
 * 
 */
var functionDeclaration = function(name, params, body) {
    return environment_semantics.putMutableBinding(name, false, functionExpression(name, params, body));
};

/* Values
 ******************************************************************************/
var numberLiteral = number.create;

var booleanLiteral = boolean.create;

var stringLiteral = string.create;

var nullLiteral = nil.create;

var regularExpressionLiteral /* @TODO */;

var identifier = function(name) {
    return environment_semantics.getBinding(name);
};

/* Export
 ******************************************************************************/
return {
// Declaration Semantics
    'variableDeclaration': variableDeclaration,
    'variableDeclarator': variableDeclarator,
    'functionDeclaration': functionDeclaration,

// Function Semantics
    'functionExpression': functionExpression,
    'sourceElements': sourceElements,
    
// Statement Semantics
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
    'tryFinallyStatement': tryFinallyStatement,
    
// Binary Operator Semantics
    'addOperator': addOperator, 
    'subtractOperator': subtractOperator, 
    'multiplyOperator': multiplyOperator, 
    'divideOperator': divideOperator, 
    'remainderOperator': remainderOperator, 
    
    'leftShiftOperator': leftShiftOperator, 
    'signedRightShiftOperator': signedRightShiftOperator, 
    'unsignedRightShiftOperator': unsignedRightShiftOperator, 
    'bitwiseAndOperator': bitwiseAndOperator,
    'bitwiseXorOperator': bitwiseXorOperator,
    'bitwiseOrOperator': bitwiseOrOperator,

// Binary Comparision Operator Semantics
    'equalOperator': equalOperator,
    'strictEqualOperator': strictEqualOperator,
    'notEqualOperator': notEqualOperator,
    'strictNotEqualOperator': strictNotEqualOperator,
    
//Binary Relational Operator Semantics
    'ltOperator': ltOperator,
    'lteOperator': lteOperator,
    'gtOperator': gtOperator,
    'gteOperator': gteOperator,
    'instanceofOperator': instanceofOperator,
    'inOperator': inOperator,

// Increment and Decrement Operator Semantics
    'prefixIncrement': prefixIncrement,
    'postfixIncrement': postfixIncrement,
    'prefixDecrement': prefixDecrement,
    'postfixDecrement': postfixDecrement,

// Unary Operator Semantics
    'unaryPlusOperator': unaryPlusOperator, 
    'unaryMinusOperator': unaryMinusOperator, 
    'logicalNotOperator': logicalNotOperator, 
    'bitwiseNotOperator': bitwiseNotOperator, 
    'voidOperator': voidOperator, 
    'typeofOperator': typeofOperator, 

// Logical Semantics
    'logicalOr': logicalOr,
    'logicalAnd': logicalAnd,

//
    'callExpression': callExpression,
    'newExpression': newExpression,
    'memberExpression': memberExpression,
    
// Expression Semantics
    'conditionalExpression': conditionalExpression,
    'sequenceExpression': sequenceExpression,
    'thisExpression': thisExpression,
    
// Literals
    'objectLiteral': objectLiteral,
    'arrayLiteral': arrayLiteral,
    
// Assignment
    'assignment': assignment,
    'compoundAssignment': compoundAssignment,

// Values
    'numberLiteral': numberLiteral,
    'booleanLiteral': booleanLiteral,
    'stringLiteral': stringLiteral,
    'nullLiteral': nullLiteral,
    'regularExpressionLiteral': regularExpressionLiteral,
    'identifier': identifier
};

});