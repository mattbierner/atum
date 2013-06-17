/**
 * @fileOverview Computations for number operations.
 */
define(['atum/compute',
        'atum/value/number'],
function(compute,
        number) {
//"use strict";

var _binaryOperation = function(op) {
    return function(l, r) {
        return compute.binary(l, r, function(lVal, rVal) {
            return compute.always(op(lVal, rVal));
        });
    };
};

var _unaryOperation = function(op) {
    return function(argument) {
        return compute.bind(argument, function(x) {
            return compute.always(op(x));
        });
    };
};


/* 
 ******************************************************************************/
/**
 * 
 */
var create = function(value) {
    return compute.always(new number.Number(value));
};


/* Binary Operation Computations
 ******************************************************************************/
/**
 * Add computation.
 */
var add = _binaryOperation(number.add);

/**
 * Subtract computation.
 */
var subtract = _binaryOperation(number.subtract);


/**
 * Multiply computation.
 */
var multiply = _binaryOperation(number.multiply);

/**
 * Divide computation.
 */
var divide = _binaryOperation(number.divide);

/**
 * Remainder computation
 */
var remainder = _binaryOperation(number.remainder);

/**
 * Left shift computation
 */
var leftShift = _binaryOperation(number.leftShift);

/**
 * Signed right shift computation
 */
var signedRightShift = _binaryOperation(number.signedRightShift);

/**
 * Unsigned right shift computation
 */
var unsignedRightShift = _binaryOperation(number.unsignedRightShift);

/**
 * Bitwise and computation
 */
var bitwiseAnd = _binaryOperation(number.bitwiseAnd);

/**
 * Bitwise xor computation
 */
var bitwiseXor = _binaryOperation(number.bitwiseXor);

/**
 * Bitwise or computation
 */
var bitwiseOr = _binaryOperation(number.bitwiseOr);

/* Relational Binary Operation Computations
 ******************************************************************************/
/**
 *
 */
var eq = _binaryOperation(number.eq);

/**
 *
 */
var lt = _binaryOperation(number.lt);

/**
 * 
 */
var lte = _binaryOperation(number.lte);

/**
 * 
 */
var gt = _binaryOperation(number.gt);

/**
 * 
 */
var gte = _binaryOperation(number.gte);

/* Unary Operation Computation
 ******************************************************************************/
/**
 * 
 */
var negate = _unaryOperation(number.negate);

/**
 * 
 */
var bitwiseNot = _unaryOperation(number.bitwiseNot);

/* Update Operation Computation
 ******************************************************************************/
/**
 * 
 */
var increment = add.bind(undefined, compute.always(new number.Number(1)));

/**
 * 
 */
var decrement = add.bind(undefined, compute.always(new number.Number(-1)));


/* Export
 ******************************************************************************/
return {
    'create': create,

// Binary Operation Computations
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide,
    'remainder': remainder,
    
    'leftShift': leftShift,
    'signedRightShift': signedRightShift,
    'unsignedRightShift': unsignedRightShift,
    'bitwiseAnd': bitwiseAnd,
    'bitwiseXor': bitwiseXor,
    'bitwiseOr': bitwiseOr,

// Binary Relational Operators
    'eq': eq,
    'lt': lt,
    'lte': lte,
    'gt': gt,
    'gte': gte,

// Unary Operation Computations
    'negate': negate,
    'bitwiseNot': bitwiseNot,

// Update Expressions
    'increment': increment,
    'decrement': decrement
};

});