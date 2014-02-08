/**
 * @fileOverview ECMAScript 5.1 expression
 */
define(['atum/completion',
        'atum/compute',
        'atum/fun',
        'atum/environment_reference',
        'atum/property_reference',
        'atum/internal_reference',
        'atum/operations/construct',
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
        fun,
        environment_reference,
        property_reference,
        internal_reference_value,
        construct,
        error,
        func,
        number,
        string,
        boolean,
        object,
        undef,
        type_conversion,
        compare,
        execution_context,
        internal_reference,
        value_reference,
        type,
        value){
"use strict";

var binaryOperator = function(op) {
    return function(left, right) {
        return compute.binary(
            internal_reference.getFrom(left),
            internal_reference.getFrom(right),
            op);
    };
};

/* 
 ******************************************************************************/
var emptyExpression = undef.UNDEFINED;

/* Unary Operator Semantics
 ******************************************************************************/
var unaryPlusOperator = compute.compose(
    internal_reference.getFrom,
    type_conversion.toNumber);

var unaryMinusOperator = compute.compose(
    internal_reference.getFrom,
    number.negate);

var logicalNotOperator = compute.compose(
    internal_reference.getFrom,
    boolean.logicalNot);

var bitwiseNotOperator = compute.compose(
    internal_reference.getFrom,
    number.bitwiseNot);

/**
 * Delete operator
 * 
 * Deletes the reference stored in the result of `argument`.
 */
var deleteOperator = function(argument) {
    return compute.bind(argument, function(ref) {
        if (!(ref instanceof internal_reference_value.InternalReference))
            return boolean.TRUE;
        return boolean.from(ref.deleteReference());
    });
};

/**
 * Void operator
 * 
 * Evaluate `argument` and discard results.
 */
var voidOperator = fun.compose(
    fun.curry(compute.then, undef.UNDEFINED),
    internal_reference.getFrom);

/**
 * Typeof operator
 * 
 * Evaluate `argument` and result in a string representing its type.
 * Errors if `argument` results in an unsupported hosted language value.
 */
var typeofOperator = compute.compose(
    compute.composeWith(function(val) {
        return (val && val.isUnresolvable ?
            undef.UNDEFINED :
            internal_reference.getValue(val));
    }),
    compute.compose(
        object.typeofObject,
        string.create));

/* Numeric Binary Operations
 ******************************************************************************/
var addOperator = function(left, right) {
    return compute.binary(
        internal_reference.dereferenceFrom(left, fun.curry(type_conversion.toPrimitive, undefined)),
        internal_reference.dereferenceFrom(right, fun.curry(type_conversion.toPrimitive, undefined)),
        function(l, r) {
            return (value.isString(l) || value.isString(r) ?
                string.concat(
                    compute.just(l),
                    compute.just(r)) :
                number.add(l, r));
        });
};

var subtractOperator = binaryOperator(number.subtract);

var multiplyOperator = binaryOperator(number.multiply);

var divideOperator = binaryOperator(number.divide);

var remainderOperator = binaryOperator(number.remainder);

var leftShiftOperator = binaryOperator(number.leftShift);

var signedRightShiftOperator = binaryOperator(number.signedRightShift);

var unsignedRightShiftOperator = binaryOperator(number.unsignedRightShift);

var bitwiseAndOperator = binaryOperator(number.bitwiseAndOperator);

var bitwiseXorOperator = binaryOperator(number.bitwiseXorOperator);

var bitwiseOrOperator = binaryOperator(number.bitwiseOrOperator);

/* Equality Operators
 ******************************************************************************/
var equalOperator = binaryOperator(compare.equal);

var strictEqualOperator = binaryOperator(compare.strictEqual);

var notEqualOperator = fun.composen(logicalNotOperator, equalOperator);

var strictNotEqualOperator = fun.composen(logicalNotOperator, strictEqualOperator);

/* Relational Operators
 ******************************************************************************/
var ltOperator = binaryOperator(number.lt);

var lteOperator = binaryOperator(number.lte);

var gtOperator = binaryOperator(number.gt);

var gteOperator = binaryOperator(number.gte);

var instanceofOperator = fun.composen(
    boolean.from,
    binaryOperator(fun.flip(object.hasInstance)));

var inOperator = fun.composen(
    boolean.from,
    binaryOperator(function(lref, rref) {
        return compute.next(
            error.assert(
                error.typeError('in rhs not object'),
                value.isObject,
                value_reference.getValue(rref)),
            compute.bind(
                string.toHost(lref),
                fun.curry(object.hasProperty, rref)));
        }));

/* Update Operator Semantics
 ******************************************************************************/
var _prefixUpdate = function(op) {
    return function(arg) {
        return internal_reference.dereferenceFrom(arg, function(val, ref) {
            if (!(ref instanceof internal_reference_value.InternalReference))
                return error.referenceError("Prefix update operator applied to non reference value");
            
            return compute.bind(
                type_conversion.toNumber(val),
                function(x) {
                    return op(ref, x);
                });
        });
    };
};

var _postfixUpdate = function(op) {
    return function(arg) {
        return internal_reference.dereferenceFrom(arg, function(val, ref) {
            if (!(ref instanceof internal_reference_value.InternalReference))
                return error.referenceError("Postfix update operator applied to non reference value");
            
            return compute.bind(
                type_conversion.toNumber(val),
                function(x) {
                    return compute.next(
                        op(ref, x),
                        compute.just(x));
                });
        });
    };
};

var _increment = function(expr, val) {
    return compute.bind(
        number.increment(val),
        fun.curry(internal_reference.setValue, expr));
};

var _decrement = function(expr, val) {
    return compute.bind(
        number.decrement(val),
        fun.curry(internal_reference.setValue, expr));
};

/**
 * Prefix increment operation.
 * 
 * Gets the current value of a reference as a number and increments bound
 * value of reference 'arg'. Returns new value after increment.
 * 
 * Errors if argument is not a reference.
 */
var prefixIncrement = _prefixUpdate(_increment);

/**
 * Semantics for a postfix increment operation.
 * 
 * Gets the current value of reference 'arg' as a number and increments bound
 * value of reference 'arg'. Returns old value before increment.
 * 
 * Errors if argument is not a reference.
 */
var postfixIncrement = _postfixUpdate(_increment);

/**
 * Prefix decrement operation
 * 
 * Gets the current value of reference 'arg' as a number and decrements bound
 * value of reference 'arg'. Returns new value after decrement.
 * 
 * Errors if argument is not a reference.
 */
var prefixDecrement = _prefixUpdate(_decrement);

/**
 * Postfix decrement operation
 * 
 * Gets the current value of reference 'arg' as a number and decrements bound
 * value of reference 'arg'. Returns old value before decrement.
 * 
 * Errors if argument is not a reference.
 */
var postfixDecrement = _postfixUpdate(_decrement);

/* Logical Binary Operator Semantics
 ******************************************************************************/
/**
 * Logical or operation
 * 
 * Shorts when left evaluates to true.
 */
var logicalOr = function(left, right) {
    return internal_reference.dereferenceFrom(left, function(l) {
        return compute.branch(boolean.isTrue(l),
            compute.just(l),
            internal_reference.getFrom(right));
    });
};

/**
 * Logical and operation
 * 
 * Shorts when left evaluates to false.
 */
var logicalAnd = function(left, right) {
    return internal_reference.dereferenceFrom(left, function(l) {
        return compute.branch(boolean.isTrue(l),
            internal_reference.getFrom(right),
            compute.just(l));
    });
};

/**
 * Conditional Expression.
 */
var conditionalExpression = function(test, consequent, alternate) {
    return internal_reference.getFrom(
        compute.branch(
            internal_reference.dereferenceFrom(test, boolean.isTrue),
            consequent,
            alternate));
};

/* 
 ******************************************************************************/
/**
 * Call expression
 * 
 * Fails if 'callee' is not callable.
 * 
 * @param callee Computation resulting in object being called. 
 * @param args Array of zero or more computations that give the arguments to
 *  call 'callee' with.
 */
var callExpression = (function() {
    var getBase = function(ref) {
        return (ref instanceof property_reference.PropertyReference ?
            ref.getBase() :
            compute.bind(ref.getBase(), function(base) { return base.implicitThisValue(); }));
    };
    
    var thisBinding = function(ref) {
        return (ref instanceof internal_reference_value.InternalReference ?
            getBase(ref) :
            undef.UNDEFINED);
    };
    
    return function(callee, args) {
        var a = compute.eager(compute.map(internal_reference.getFrom, args));
        return internal_reference.dereferenceFrom(callee, function(o, ref) {
            return compute.bind(thisBinding(ref), function(t) {
                return func.functionCall(o, t, a);
            });
        });
    };
}());

/**
 * New Expression
 */
var newExpression = function(callee, args) {
    return compute.binds(
        compute.enumeration(
            internal_reference.getFrom(callee),
            compute.eager(compute.map(internal_reference.getFrom, args))),
        construct.construct);
};

/**
 * Member expression
 */
var memberExpression = function(base, property) {
    return internal_reference.dereferenceFrom(base, function(baseValue, baseRef) {
        return compute.binds(
            compute.enumeration(
                value_reference.getValue(baseValue),
                internal_reference.dereferenceFrom(property, string.toHost)),
            function(baseObj, propertyName) {
                return (baseObj instanceof value.Value ?
                    property_reference.create(propertyName, baseValue) :
                    environment_reference.create(propertyName, baseRef));
            });
    });
};

/* 
 ******************************************************************************/
/**
 * Sequence expression
 * 
 * @param expressions Array of expression computations.
 */
var sequenceExpression = fun.curry(compute.map_,
    internal_reference.getFrom);

/**
 * This expression
 */
var thisExpression = execution_context.thisBinding;

/* Assignment Semantics
 ******************************************************************************/
var _dereference = function(ref) {
    return compute.bind(ref, function(x) {
        if (!(x instanceof internal_reference_value.InternalReference))
            return compute.error("Left hand side not reference");
        
        if (x.strict && (x.name === "eval" || x.name === "arguments"))
            return compute.error("Using eval/arguments in strict");
        
        return compute.just(x);
    });
};

/**
 * Assignment expression
 */
var assignment = function(left, right) {
    return compute.binary(
        _dereference(left),
        internal_reference.getFrom(right),
        function(l, r) {
            return compute.next(
                internal_reference.setValue(l, r),
                compute.just(r));
        });
};

/**
 * Compound Assignment expression
 */
var compoundAssignment = function(op, left, right) {
    return compute.bind(left, function(lref) {
        return assignment(
            compute.just(lref),
            op(
                internal_reference.getValue(lref),
                internal_reference.getFrom(right)));
        });
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
    'deleteOperator': deleteOperator,
    'voidOperator': voidOperator,
    'typeofOperator': typeofOperator,

// Logical Semantics
    'logicalOr': logicalOr,
    'logicalAnd': logicalAnd,
    'conditionalExpression': conditionalExpression,

//
    'callExpression': callExpression,
    'newExpression': newExpression,
    'memberExpression': memberExpression,
    
// Expression Semantics
    'sequenceExpression': sequenceExpression,
    'thisExpression': thisExpression,
    
// Assignment
    'assignment': assignment,
    'compoundAssignment': compoundAssignment
};

});