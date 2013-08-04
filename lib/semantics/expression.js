/**
 * @fileOverview ECMAScript 5.1 expression semantics.
 */
define(['atum/completion',
        'atum/compute',
        'atum/debug/operations',
        'atum/internal_reference',
        'atum/context/environment',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/string',
        'atum/operations/boolean',
        'atum/operations/object',
        'atum/operations/undef',
        'atum/operations/type_conversion',
        'atum/operations/compare',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/value'],
function(completion,
        compute,
        debug_operations,
        internal_reference_value,
        environment,
        environment_semantics,
        error,
        func_operations,
        number,
        string,
        boolean,
        object,
        undef_semantics,
        type_conversion,
        compare,
        execution_context,
        internal_reference,
        value_reference,
        type,
        value){
//"use strict";

var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);
var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);

/* 
 ******************************************************************************/
var emptyExpression = function() {
    return undef_semantics.create();
};

/* Binary Operator Semantics
 ******************************************************************************/
/**
 * 
 */
var addOperator = function(left, right) {
    return compute.binary(
        type_conversion.toPrimitive(internal_reference.getValue(left)),
        type_conversion.toPrimitive(internal_reference.getValue(right)),
        function(lprim, rprim) {
            var l = compute.just(lprim),
                r = compute.just(rprim);
            return (value.isString(lprim) || value.isString(rprim) ?
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
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var multiplyOperator = function(left, right) {
    return number.multiply(
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var divideOperator = function(left, right) {
    return number.divide(
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var remainderOperator = function(left, right) {
    return number.remainder(
        type_conversion.toNumber(internal_reference.getValue(left)),
        type_conversion.toNumber(internal_reference.getValue(right)));
};

/**
 * 
 */
var leftShiftOperator = function(left, right) {
    return number.leftShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toUint32(internal_reference.getValue(right)));
};

/**
 * 
 */
var signedRightShiftOperator = function(left, right) {
    return number.signedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toUint32(internal_reference.getValue(right)));
};

/**
 * 
 */
var unsignedRightShiftOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toUint32(internal_reference.getValue(right)));
};

/**
 * 
 */
var bitwiseAndOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toInt32(internal_reference.getValue(right)));
};

/**
 * 
 */
var bitwiseXorOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toInt32(internal_reference.getValue(right)));
};

/**
 * 
 */
var bitwiseOrOperator = function(left, right) {
    return number.unsignedRightShift(
        type_conversion.toInt32(internal_reference.getValue(left)),
        type_conversion.toInt32(internal_reference.getValue(right)));
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
        internal_reference.getValue(left),
        internal_reference.getValue(right));
};

/**
 * Semantics for a strict equal operator.
 * 
 * Does a strict comparison of 'left' value to 'right' value.
 */
var strictEqualOperator = function(left, right) {
    return compare.strictEqual(
        internal_reference.getValue(left),
        internal_reference.getValue(right));
};

/**
 * Semantics for a not equal operator.
 */
var notEqualOperator = function(left, right) {
    return logicalNotOperator(
        equalOperator(left, right));
};

/**
 * Semantics for a strict not equal operator.
 */
var strictNotEqualOperator = function(left, right) {
    return logicalNotOperator(
        strictEqualOperator(left, right));
};


/* Numeric Binary Relational Operators
 * 
 * @TODO Should we return undefined values when NaN is used?
 ******************************************************************************/
var _relationalOperator = function(op) {
    return function(left, right) {
        return op(
            type_conversion.toNumber(internal_reference.getValue(left)),
            type_conversion.toNumber(internal_reference.getValue(right)));
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

/**
 * Instanceof operation semantics.
 */
var instanceofOperator = function(left, right) {
    return compute.Computation('Instanceof',
        compute.bind(
            object.hasInstance(
                internal_reference.getValue(right),
                internal_reference.getValue(left)),
            boolean.create));
};

var inOperator /* TODO */;

/* Unary Operator Semantics
 ******************************************************************************/
/**
 * Unary plus operator semantics.
 */
var unaryPlusOperator = function(argument) {
    return compute.Computation('Unary Plus',
        type_conversion.toNumber(
            internal_reference.getValue(argument)));
};

/**
 * Unary Minus operator semantics.
 */
var unaryMinusOperator = function(argument) {
    return compute.Computation('Unary Minus',
        number.negate(
            type_conversion.toNumber(
                internal_reference.getValue(argument))));
};

/**
 * Logical Not operator semantics.
 */
var logicalNotOperator = function(argument) {
    return compute.Computation('Logical Not',
        boolean.logicalNot(
            type_conversion.toBoolean(
                internal_reference.getValue(argument))));
};

/**
 * Bitwise not operator semantics.
 */
var bitwiseNotOperator = function(argument) {
    return compute.Computation('Bitwise Not',
        number.bitwiseNot(
            type_conversion.toInt32(
                internal_reference.getValue(argument))));
};

/**
 * Void operator semantics.
 * 
 * Evaluate `argument` and discard results.
 */
var voidOperator = function(argument) {
    return compute.Computation('Void',
        compute.next(
            internal_reference.getValue(argument),
            undef_semantics.create()));
};

/**
 * Typeof operator semantics.
 * 
 * Evaluate `argument` and result in a string representing its type.
 * Errors if `argument` results in an unsupported hosted language value.
 */
var typeofOperator = function(argument) {
    return compute.Computation('Typeof',
        compute.bind(
            value_reference.getValue(internal_reference.getValue(argument)),
            function(val) {
                switch (value.type(val)) {
                case type.BOOLEAN_TYPE:
                    return string.create("boolean");
                case type.NULL_TYPE:
                    return string.create("object");
                case type.NUMBER_TYPE:
                    return string.create("number");
                case type.OBJECT_TYPE:
                    return string.create(value.isCallable(val) ?
                        "function":
                        "object")
                case type.STRING_TYPE:
                    return string.create("string");
                case type.UNDEFINED:
                    return string.create("undefined");
                default:
                    return error.typeError();
                }
            }));
};

/* Update Operator Semantics
 ******************************************************************************/
var _prefixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof internal_reference_value.InternalReference))
                return error.referenceError(string.create("Prefix update operator applied to non reference value"));
            return op(arg, type_conversion.toNumber(internal_reference.getValue(arg)));
        });
    };
};

var _postfixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof internal_reference_value.InternalReference))
                return error.referenceError(string.create("Postfix update operator applied to non reference value"));
            return compute.bind(
                type_conversion.toNumber(internal_reference.getValue(arg)),
                function(x) {
                    var ax = compute.just(x);
                    return compute.next(op(arg, ax), ax);
                });
        });
    };
};

var _increment = function(expr, val) {
    return internal_reference.setValue(expr, number.increment(val));
};

var _decrement = function(expr, val) {
    return internal_reference.setValue(expr, number.decrement(val));
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
 * Logical or operation semantics.
 * 
 * Shorts when left evaluates to true.
 */
var logicalOr = function(left, right) {
    return compute.Computation('Logical Or',
        compute.bind(
            internal_reference.getValue(left),
            function(l) {
                return compute.branch(
                    boolean.isTrue(type_conversion.toBoolean(compute.just(l))),
                    compute.just(l),
                    internal_reference.getValue(right));
            }));
};

/**
 * Logical and operation semantics.
 * 
 * Shorts when left evaluates to false.
 */
var logicalAnd = function(left, right) {
    return compute.Computation('Logical And',
        compute.bind(
            internal_reference.getValue(left),
            function(l) {
                return compute.branch(
                    boolean.isTrue(type_conversion.toBoolean(compute.just(l))),
                    internal_reference.getValue(right),
                    compute.just(l));
            }));
};

/* 
 ******************************************************************************/
/**
 * Call expression semantics.
 * 
 * Either succeeds with calling 'callee' or fails if 'callee' is not callable. 
 * 
 * @param callee Computation resulting in object being called. 
 * @param args Array of zero or more computations that give the arguments to
 *  call 'callee' with.
 */
var callExpression = (function(){
    var getThisBinding = function(ref) {
        return (ref instanceof internal_reference_value.InternalReference ?
            compute.bind(ref.getBase(), function(base) {
                return compute.just(ref instanceof object.PropertyReference ?
                    base :
                    base.implicitThisValue());
            }) : 
            execution_context.getThisBinding());
    };
    
    return function(callee, args) {
        return compute.Computation('Call Expression',
            compute.bind(callee, function(ref) {
                return debug_operations.debuggableCall(func_operations.call(
                    internal_reference.getValue(compute.just(ref)),
                    value_reference.getValue(internal_reference.getValue(compute.just(ref))),
                    getThisBinding(ref),
                    compute.sequencea(map(args, internal_reference.getValue))));
            }));
    };
}());

/**
 * New Expression semantics.
 */
var newExpression = function(callee, args) {
    return compute.Computation('New Expression',
        object.construct(
            internal_reference.getValue(callee),
            compute.sequencea(map(args, internal_reference.getValue))));
};

/**
 * Member expression semantics.
 */
var memberExpression = function(base, property) {
    return compute.Computation('Member Expression',
        compute.binds(
            compute.sequence(
                execution_context.getStrict(),
                base,
                value_reference.getValue(internal_reference.getValue(base)),
                type_conversion.toString(internal_reference.getValue(property))),
            function(strict, baseRef, baseValue, propertyName) {
                var name = propertyName.value;
                return compute.just(baseValue instanceof environment.LexicalEnvironment ?
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
        internal_reference.getValue(
            compute.branch(
                boolean.isTrue(type_conversion.toBoolean(internal_reference.getValue(test))),
                consequent,
                alternate)));
};

/**
 * Sequence expression semantics.
 * 
 * @param expressions Array of two or more expression computations.
 */
var sequenceExpression = function(expressions) {
    return compute.Computation('Sequence Expression',
        reduce(expressions, function(p, c) {
            return compute.next(p, internal_reference.getValue(c));
        }));
};

/**
 * This expression semantics.
 */
var thisExpression = function() {
    return compute.Computation('This Expression',
        execution_context.getThisBinding());
};

/* Assignment Semantics
 ******************************************************************************/
var _dereference = function(ref) {
    return compute.bind(ref, function(x) {
        if (!(x instanceof internal_reference_value.InternalReference))
            return compute.error("Left hand side not reference");
        
        if (x.strict &&
            (x.name === "eval" || x.name === "arguments")) {
            return compute.error("Using eval/arguments in strict");
        }
        return compute.just(x);
    });
};

/**
 * Semantics for simple assignment.
 */
var assignment = function(left, right) {
    return compute.binary(
        _dereference(left),
        internal_reference.getValue(right),
        function(l, r) {
            return compute.next(l.setValue(r), compute.just(r));
        });
};

/**
 * Semantics for an assignment that modifies a value by modifying its current value.
 */
var compoundAssignment = function(op, left, right) {
    return assignment(
        left,
        op(
            internal_reference.getValue(left),
            internal_reference.getValue(right)));
};

/* Export
 ******************************************************************************/
return {
    'emptyExpression': emptyExpression,
    
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
    
// Assignment
    'assignment': assignment,
    'compoundAssignment': compoundAssignment
};

});