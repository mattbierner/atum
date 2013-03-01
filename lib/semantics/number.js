/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/value/number'],
function(compute,
        number) {
//"use strict";

/* Binary Operation Computations
 ******************************************************************************/

var _operationComputation = function(op) {
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

/**
 * Add computation.
 */
var add = _operationComputation(number.add);

/**
 * Subtract computation.
 */
var subtract = _operationComputation(number.subtract);


/**
 * Multiply computation.
 */
var multiply = _operationComputation(number.multiply);


/**
 * Divide computation.
 */
var divide = _operationComputation(number.divide);

/**
 * Remainder computation
 */
var remainder = _operationComputation(number.remainder);

/**
 * Left shift computation
 */
var leftShift = _operationComputation(number.leftShift);

/**
 * Signed right shift computation
 */
var signedRightShift = _operationComputation(number.signedRightShift);

/**
 * Unsigned right shift computation
 */
var unsignedRightShift = _operationComputation(number.unsignedRightShift);

/**
 * Bitwise and computation
 */
var bitwiseAnd = _operationComputation(number.bitwiseAnd);

/**
 * Bitwise xor computation
 */
var bitwiseXor = _operationComputation(number.bitwiseXor);

/**
 * Bitwise or computation
 */
var bitwiseOr = _operationComputation(number.bitwiseOr);

/* Unary Operation Computation
 ******************************************************************************/
/**
 * 
 */
var negate = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(number.negate(x));
    });
};

/**
 * 
 */
var bitwiseNot = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(number.bitwiseNot(x));
    });
};



/* Export
 ******************************************************************************/
return {
    'Number': Number,

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
    
// Unary Operation Computations
    'negate': negate,
    'bitwiseNot': bitwiseNot
};

});