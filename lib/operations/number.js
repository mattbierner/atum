/**
 * @fileOverview Number operation computations.
 */
define(['atum/compute',
        'atum/value/number'],
function(compute,
        number) {
"use strict";

var _binaryOperation = function(op) {
    return function(l, r) {
        return compute.binary(l, r, function(lVal, rVal) {
            return compute.just(op(lVal, rVal));
        });
    };
};

var _unaryOperation = function(op) {
    return function(argument) {
        return compute.bind(argument, function(x) {
            return compute.just(op(x));
        });
    };
};

/* Creation
 ******************************************************************************/
/**
 * Create a hosted number value.
 * 
 * @param {number} value Host language value for hosted number.
 */
var create = function(value) {
    return compute.just(new number.Number(value));
};

/* Binary Operations
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

/* Bitwise Operations
 ******************************************************************************/
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

/* Relational Binary Operations
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

/* Unary Operations
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
var increment = add.bind(undefined, compute.just(new number.Number(1)));

/**
 * 
 */
var decrement = add.bind(undefined, compute.just(new number.Number(-1)));


/* Export
 ******************************************************************************/
return {
// Creation
    'create': create,

// Binary Operations
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide,
    'remainder': remainder,
    
// Bitwise Operations
    'leftShift': leftShift,
    'signedRightShift': signedRightShift,
    'unsignedRightShift': unsignedRightShift,
    'bitwiseAnd': bitwiseAnd,
    'bitwiseXor': bitwiseXor,
    'bitwiseOr': bitwiseOr,

// Binary Relational Operations
    'eq': eq,
    'lt': lt,
    'lte': lte,
    'gt': gt,
    'gte': gte,

// Unary Operations
    'negate': negate,
    'bitwiseNot': bitwiseNot,

// Update Operations
    'increment': increment,
    'decrement': decrement
};

});