/**
 * @fileOverview Computations for number operations.
 */
define(['atum/compute',
        'atum/value/number',
        'atum/semantics/iref'],
function(compute,
        number,
        iref) {
//"use strict";

var _binaryOperation = function(op) {
    return function(left, right) {
        return compute.bind(
            left,
            function(lnum) {
                return compute.bind(
                    right,
                    function(rnum) {
                        return compute.always(op(lnum, rnum));
                    });
            });
    };
};

var _unaryOperation = function(op) {
    return function(argument) {
        return compute.bind(
            argument,
            function(result) {
                return compute.always(op(result));
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
var gte = _binaryOperation(number.lte);

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
var increment = function(num) {
    return compute.bind(
        num,
        function(oldValue) {
            return compute.always(number.add(oldValue, new number.Number(1)));
        });
};

/**
 * 
 */
var decrement = function(num) {
    return compute.bind(
        num,
        function(oldValue) {
            return compute.always(number.add(oldValue, new number.Number(-1)));
        });
};


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