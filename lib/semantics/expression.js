/**
 * @fileOverview ECMAScript 5.1 expression
 */
define(['atum/completion',
        'atum/compute',
        'atum/environment_reference',
        'atum/property_reference',
        'atum/debug/operations',
        'atum/internal_reference',
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
        environment_reference,
        property_reference,
        debug_operations,
        internal_reference_value,
        error,
        func_operations,
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
//"use strict";

var map = Function.prototype.call.bind(Array.prototype.map);

/* 
 ******************************************************************************/
var emptyExpression = function() {
    return undef.UNDEFINED;
};

/* Binary Operator Semantics
 ******************************************************************************/
var _binaryOperator = function(op) {
    return function(left, right) {
        return op(
            internal_reference.getFrom(left),
            internal_reference.getFrom(right));
    };
};

/**
 * Addition operator
 */
var addOperator = function(left, right) {
    return compute.binary(
        internal_reference.dereferenceFrom(left, type_conversion.toPrimitive),
        internal_reference.dereferenceFrom(right, type_conversion.toPrimitive),
        function(l, r) {
            return (value.isString(l) || value.isString(r) ?
                string.concat(
                     type_conversion.toString(l),
                     type_conversion.toString(r)) :
                number.add(
                    compute.just(l),
                    compute.just(r)));
        });
};

/**
 * Subtraction operator
 */
var subtractOperator = _binaryOperator(number.subtract);

/**
 * Multiplication operator
 */
var multiplyOperator = _binaryOperator(number.multiply);

/**
 * Division operator
 */
var divideOperator = _binaryOperator(number.divide);

/**
 * Modulo operator
 */
var remainderOperator = _binaryOperator(number.remainder);

/**
 * Left shift operator
 */
var leftShiftOperator = _binaryOperator(number.leftShift);

/**
 * Signed right shift operator
 */
var signedRightShiftOperator = _binaryOperator(number.signedRightShift);

/**
 * Unsigned right shift operator
 */
var unsignedRightShiftOperator = _binaryOperator(number.unsignedRightShift);

/**
 * Bitwise and operator
 */
var bitwiseAndOperator = _binaryOperator(number.bitwiseAndOperator);

/**
 * Bitwise xor operator
 */
var bitwiseXorOperator = _binaryOperator(number.bitwiseXorOperator);

/**
 * Bitwise or operator
 */
var bitwiseOrOperator = _binaryOperator(number.bitwiseOrOperator);

/* Equality Relational Operators
 ******************************************************************************/
/**
 * Equals operator
 */
var equalOperator = function(left, right) {
    return compute.binary(
        internal_reference.getFrom(left),
        internal_reference.getFrom(right),
        compare.equal);
};

/**
 * Strict equals operator
 */
var strictEqualOperator = function(left, right) {
    return compute.binary(
        internal_reference.getFrom(left),
        internal_reference.getFrom(right),
        compare.strictEqual);
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
 ******************************************************************************/
/**
 * Less than operator
 */
var ltOperator = _binaryOperator(number.lt);

/**
 * Less than or equal to operator
 */
var lteOperator = _binaryOperator(number.lte);

/**
 * Greater than operator
 */
var gtOperator = _binaryOperator(number.gt);

/**
 * Greater than or equal to operator
 */
var gteOperator = _binaryOperator(number.gte);

/**
 * Instanceof operator
 */
var instanceofOperator = function(left, right) {
    return compute.Computation('Instanceof operator',
        boolean.from(
            compute.binary(
                internal_reference.getFrom(right),
                internal_reference.getFrom(left),
                object.hasInstance)));
};

/**
 * In operator
 */
var inOperator = function(left, right) {
    return compute.Computation('In operator',
        boolean.from(
            compute.binary(
                internal_reference.getFrom(left),
                internal_reference.getFrom(right),
                function(lref, rref) {
                    return value_reference.dereference(rref, function(rval) {
                        if (!value.isObject(rval))
                            return error.typeError(string.create('in rhs not object'));
                        return compute.bind(type_conversion.toString(lref), function(key) {
                            return rval.hasProperty(rref, key.value);
                        });
                    });
                })));
};

/* Unary Operator Semantics
 ******************************************************************************/
/**
 * Unary plus operator
 */
var unaryPlusOperator = function(argument) {
    return compute.Computation('Unary Plus',
        internal_reference.dereferenceFrom(argument, type_conversion.toNumber));
};

/**
 * Unary Minus operator
 */
var unaryMinusOperator = function(argument) {
    return compute.Computation('Unary Minus',
        number.negate(
            internal_reference.getFrom(argument)));
};

/**
 * Logical Not operator
 */
var logicalNotOperator = function(argument) {
    return compute.Computation('Logical Not',
        boolean.logicalNot(
            internal_reference.getFrom(argument)));
};

/**
 * Bitwise not operator
 */
var bitwiseNotOperator = function(argument) {
    return compute.Computation('Bitwise Not',
        number.bitwiseNot(
            internal_reference.dereferenceFrom(argument, type_conversion.toInt32)));
};

/**
 * Delete operator
 * 
 * Deletes the reference stored in the result of `argument`.
 */
var deleteOperator = function(argument) {
    return compute.Computation('Delete',
        compute.bind(argument, function(ref) {
            if (!(ref instanceof internal_reference_value.InternalReference))
                return boolean.TRUE;
            return compute.next(
                ref.deleteReference(),
                boolean.TRUE);
        }));
};

/**
 * Void operator
 * 
 * Evaluate `argument` and discard results.
 */
var voidOperator = function(argument) {
    return compute.Computation('Void',
        compute.next(
            internal_reference.getFrom(argument),
            undef.UNDEFINED));
};

/**
 * Typeof operator
 * 
 * Evaluate `argument` and result in a string representing its type.
 * Errors if `argument` results in an unsupported hosted language value.
 */
var typeofOperator = function(argument) {
    return compute.Computation('Typeof operator',
        compute.bind(argument, function(val) {
            return (val && val.isUnresolvable ?
                string.create('undefined') : 
                string.from(
                    object.typeofObject(
                        internal_reference.getValue(val))));
        }));
};

/* Update Operator Semantics
 ******************************************************************************/
var _prefixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof internal_reference_value.InternalReference))
                return error.referenceError(string.create("Prefix update operator applied to non reference value"));
            return op(arg, internal_reference.dereferenceFrom(arg, type_conversion.toNumber));
        });
    };
};

var _postfixUpdate = function(op) {
    return function(arg) {
        return compute.bind(arg, function(x) {
            if (!(x instanceof internal_reference_value.InternalReference))
                return error.referenceError(string.create("Postfix update operator applied to non reference value"));
            return compute.bind(
                internal_reference.dereferenceFrom(arg, type_conversion.toNumber),
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
 * Logical or operation
 * 
 * Shorts when left evaluates to true.
 */
var logicalOr = function(left, right) {
    return compute.Computation('Logical Or',
        compute.bind(
            internal_reference.getFrom(left),
            function(l) {
                return compute.branch(
                    boolean.isTrue(type_conversion.toBoolean(l)),
                    compute.just(l),
                    internal_reference.getFrom(right));
            }));
};

/**
 * Logical and operation
 * 
 * Shorts when left evaluates to false.
 */
var logicalAnd = function(left, right) {
    return compute.Computation('Logical And',
        compute.bind(
            internal_reference.getFrom(left),
            function(l) {
                return compute.branch(
                    boolean.isTrue(type_conversion.toBoolean(l)),
                    internal_reference.getFrom(right),
                    compute.just(l));
            }));
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
        return compute.bind(ref.getBase(), function(base) {
            return (ref instanceof property_reference.PropertyReference ?
                compute.just(base) :
                base.implicitThisValue());
        });
    };
    
    var thisBinding = function(ref) {
        return (ref instanceof internal_reference_value.InternalReference ?
            getBase(ref) :
            undef.UNDEFINED);
    };
    
    return function(callee, args) {
        return compute.Computation('Call Expression',
            internal_reference.dereferenceFrom(callee, function(o, ref) {
                return debug_operations.debuggableCall(
                    func_operations.call(
                        compute.just(o),
                        thisBinding(ref),
                        compute.enumerationa(map(args, internal_reference.getFrom))));
            }));
    };
}());

/**
 * New Expression
 */
var newExpression = function(callee, args) {
    return compute.Computation('New Expression',
        compute.binds(
            compute.enumeration(
                internal_reference.getFrom(callee),
                compute.enumerationa(map(args, internal_reference.getFrom))),
            object.construct));
};

/**
 * Member expression
 */
var memberExpression = function(base, property) {
    return compute.Computation('Member Expression',
        compute.binds(
            compute.enumeration(
                execution_context.strict,
                base,
                value_reference.getFrom(internal_reference.getFrom(base)),
                internal_reference.dereferenceFrom(property, type_conversion.toString)),
            function(strict, baseRef, baseValue, propertyName) {
                var name = propertyName.value;
                return compute.just(baseValue instanceof value.Value ?
                    new property_reference.PropertyReference(name, baseRef, strict) :
                    new environment_reference.EnvironmentReference(name, baseRef, strict));
            }));
};

/* 
 ******************************************************************************/
/**
 * Conditional Expression.
 */
var conditionalExpression = function(test, consequent, alternate) {
    return compute.Computation('Conditional Expression',
        internal_reference.getFrom(
            compute.branch(
                boolean.isTrue(
                    internal_reference.dereferenceFrom(test, type_conversion.toBoolean)),
                consequent,
                alternate)));
};

/**
 * Sequence expression
 * 
 * @param expressions Array of two or more expression computations.
 */
var sequenceExpression = function(expressions) {
    return compute.Computation('Sequence Expression',
        compute.sequencea(map(expressions, internal_reference.getFrom)));
};

/**
 * This expression
 */
var thisExpression = function() {
    return compute.Computation('This Expression',
        execution_context.thisBinding);
};

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
            return compute.next(l.setValue(r), compute.just(r));
        });
};

/**
 * Compound Assignment expression
 */
var compoundAssignment = function(op, left, right) {
    return assignment(
        left,
        op(
            internal_reference.getFrom(left),
            internal_reference.getFrom(right)));
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