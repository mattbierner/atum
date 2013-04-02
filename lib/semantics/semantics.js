/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/reference',
        'atum/context/environment', 'atum/context/execution_context',
        'atum/value/value', 'atum/value/func',
        'atum/semantics/environment',
        'atum/semantics/number', 'atum/semantics/string', 'atum/semantics/boolean', 'atum/semantics/object',
        'atum/semantics/nil', 'atum/semantics/undef',
        'atum/semantics/type_conversion', 'atum/semantics/compare',
        'atum/semantics/completion', 'atum/semantics/reference',
        'atum/semantics/value_reference'],
function(compute,
        reference,
        environment, execution_context,
        value, func,
        environment_semantics,
        number, string, boolean, object,
        nil, undef,
        type_conversion, compare,
        completion, reference_semantics,
        value_reference){
//"use strict";

/* 
 ******************************************************************************/

    

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
            undef.create());
    });
    
    return compute.Computation('Function',
        compute.bind(
            compute.context,
            function(ctx) {
                return compute.always(new func.Function(ctx.lexicalEnvironment, id, params, code, false));
            }));
};

/* Statement Semantics
 ******************************************************************************/
/**
 * 
 */
var emptyStatement = function() {
    return compute.always(null);
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
    return compute.Computation('Statement List', 
        (statements.length === 0 ?
            undef.create() :
            compute.bind(
                statements[0],
                function(x) {
                    return (x instanceof completion.Completion || statements.length <= 1 ?
                        compute.always(x) :
                        statementList(statements.slice(1)));
                })));
};

/**
 * Semantics for an expression statement.
 * 
 * @param expresssion
 */
var expressionStatement = reference_semantics.getValue;

/**
 * Semantics for an if statement
 */
var ifStatement = function(test, consequent, alternate) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(test)),
        function(x) {
            return (x.value ?
                consequent :
                alternate);
        });
};

/**
 * Semantics for a return statement.
 */
var returnStatement = function(argument) {
    return compute.Computation('Return Statement',
        compute.bind(
            reference_semantics.getValue(argument),
            function(x) {
                return compute.always(new completion.ReturnCompletion(x));
            }));
};

/**
 * Semantics for a throw statement.
 */
var throwStatement = function(argument) {
    return compute.Computation('Throw Statement',
        compute.bind(
            reference_semantics.getValue(argument),
            compute.never));
};

/**
 * Semantics for a break statement.
 * 
 * @param {String} [label]
 */
var breakStatement = function(label) {
    return compute.always(new completion.BreakCompletion(label));
};

/**
 * Semantics for a continue statement
 * 
 * @param {String} [label]
 */
var continueStatement = function(label) {
    return compute.always(new completion.ContinueCompletion(label));
};

/* Iteration Statement Semantics
 ******************************************************************************/
/**
 * 
 */
var doWhileStatement = function(body, test) {
    return compute.bind(body, function(v) {
        if (v instanceof completion.Completion) {
            return compute.always(v);
        } else {
            return compute.bind(
                type_conversion.toBoolean(reference_semantics.getValue(test)),
                function(iterating) {
                    return (iterating.value === false ?
                        compute.always(v) :
                        doWhileStatement(body, test));
                });
        }
    });
};

/**
 * 
 */
var whileStatement = function(test, body) {
    var iter = function(v) {
        return compute.bind(
            type_conversion.toBoolean(reference_semantics.getValue(test)),
            function(iterating) {
                return (iterating.value === false ?
                    compute.always(v) :
                    compute.bind(body, function(v) {
                        return (v instanceof completion.Completion ?
                            compute.always(v) :
                            iter(v));
                    }));
            });
    };
    return iter(null);
};

/**
 * 
 */
var forStatement = function(init, test, update, body) {
    return compute.next(init,
        whileStatement(
            test,
            compute.bind(body, function(v) {
                return compute.next(update, compute.always(v));
            })));
};

/**
 * @TODO
 */
var forInStatement;


/* Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var addOperator = function(left, right) {
    return compute.binda(
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
    return logicalNot(equalOperator(left, right));
};

/**
 * Semantics for a strict not equal operator.
 */
var strictNotEqualOperator = function(left, right) {
    return logicalNot(strictEqualOperator(left, right));
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
        undef.create());
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
            return (result.value === true ?
                left :
                right);
    });
};

/**
 * Semantics for a logical and operation. Shorts when left evaluates to false.
 */
var logicalAnd = function(left, right) {
    return compute.bind(
        type_conversion.toBoolean(reference_semantics.getValue(left)),
        function(result) {
            return (result.value === true ?
                right :
                left);
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
 *     call 'callee' with.
 */
var callExpression = function(callee, args) {
    return compute.Computation('Call Expression',
        compute.binda(
            compute.sequence(
                callee,
                reference_semantics.getValue(callee)),
            function(ref, func) {
                return compute.binda(
                    compute.sequence(
                        compute.sequence.apply(undefined, args.map(reference_semantics.getValue)),
                        reference.getBase(ref)),
                    function(args, base) {
                        if (value.type(func) !== 'object' || !value.isCallable(func)) {
                            return compute.never("TypeError");
                        }
                        var thisObj = (ref instanceof reference.Reference ?
                            (ref instanceof object.PropertyReference ?
                                base :
                                base.implicitThisValue()) :
                            undef.create());
                        return func.call(thisObj, args);
                    });
            }));
};

var newExpression = function(callee, args) {
    return compute.binda(
        compute.sequence(
            callee,
            value_reference.get(reference_semantics.getValue(callee)),
            compute.sequence.apply(undefined, args.map(reference_semantics.getValue))),
        function(ref, constructor, a) {
            return (value.type(constructor) === object.OBJECT_TYPE ?
                constructor.construct(a) :
                compute.never("Construct err"));
        });
};


/**
 * Semantics for a member expression.
 */
var memberExpression = function(base, property) {
    return compute.Computation('Member Expression',
        compute.binda(
            compute.sequence(
                compute.context,
                base,
                type_conversion.toString(reference_semantics.getValue(property))),
            function(ctx, baseValue, name) {
                return compute.always(new object.PropertyReference(name.value, baseValue, ctx.strict));
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
                return reference_semantics.getValue(x.value ?
                    consequent :
                    alternate);
            }));
};

/**
 * Semantics for a sequence of two or more expressions.
 */
var sequenceExpression = function(expressions) {
    return compute.Computation('Sequence Expression',
        expressions.reduce(function(p, c) {
            return compute.next(p, reference_semantics.getValue(c));
        }));
};

/**
 * 
 */
var thisExpression = function() {
    return compute.Computation('This Expression',
        compute.bind(
            compute.context,
            function(ctx) {
                return compute.always(ctx.thisBinding);
            }));
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
        return object.defineProperty(p, key, properties[key]);
    }, object.create(null, {}));
};

var arrayLiteral;

/* Assignment Semantics
 ******************************************************************************/
var _dereference = function(lref) {
    if (lref instanceof reference.Reference &&
        lref.strict &&
        lref.base instanceof e
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
var compoundAssignment = function(op) {
    return function(left, right) {
        return reference_semantics.putValue(
            compute.bind(left, _dereference),
            op(
                reference_semantics.getValue(left),
                reference_semantics.getValue(right)));
    };
};

/* Declaration Semantics
 ******************************************************************************/
/**
 * Semantics for a variable declaration.
 * 
 * @param {Array} declarations One or more computations for declaring a variable.
 */
var variableDeclaration = function(declarations) {
    return declarations.reduce(compute.next);
};

/**
 * Semantics for a single variable declarator.
 * 
 * @parma {string} id Identifier to bind to value.
 */
var variableDeclarator = function(id) {
    return compute.bind(
        compute.context,
        function(ctx) {
            return environment_semantics.putMutableBinding(id, ctx.strict, undef.create());
        });
};

/**
 * Semantics for a single variable declarator.
 * 
 * @parma {string} id Identifier to bind to value.
 * @param init Computation that returns initial value of bound varaible.
 */
var initVariableDeclarator = function(id, init) {
    return compute.bind(
        compute.context,
        function(ctx) {
            return environment_semantics.setMutableBinding(id, ctx.strict, reference_semantics.getValue(init));
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
    return environment_semantics.getIdentifierReference(name);
};

/* Export
 ******************************************************************************/
return {
// Function Semantics
    'functionDeclaration': functionDeclaration,
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
    
// Iteration Statement semantics
    'doWhileStatement': doWhileStatement,
    'whileStatement': whileStatement,
    'forStatement': forStatement,
    'forInStatement': forInStatement,
    
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

// Declaration Semantics
    'variableDeclaration': variableDeclaration,
    'variableDeclarator': variableDeclarator,
    'initVariableDeclarator': initVariableDeclarator,
    
// Values
    'numberLiteral': numberLiteral,
    'booleanLiteral': booleanLiteral,
    'stringLiteral': stringLiteral,
    'nullLiteral': nullLiteral,
    'regularExpressionLiteral': regularExpressionLiteral,
    'identifier': identifier
};

});