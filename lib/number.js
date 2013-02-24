define(['atum/compute', 'atum/value'],
function(compute, value) {
//"use strict";

/* Number
 ******************************************************************************/
/**
 * 
 */
var Number = function(v) {
    value.Value.call(this, "number", v);
};
Number.prototype = new value.Value;

/* Binary Operations
 ******************************************************************************/
var _operation = function(op) {
    return function(left, right) {
        return new Number(op(left.value, right.value));
    };
};

var addOperation = _operation(function(left, right) { return left + right; });

var subtractOperation = _operation(function(left, right) { return left - right; });

var multiplyOperation = _operation(function(left, right) { return left * right; });

var divideOperation = _operation(function(left, right) { return left / right; });

var remainderOperation = _operation(function(left, right) { return left % right; });

var leftShiftOperation = _operation(function(left, right) { return left << right; });

var signedRightShiftOperation = _operation(function(left, right) { return left >> right; });

var unsignedRightShiftOperation = _operation(function(left, right) { return left >>> right; });


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
var add = _operationComputation(addOperation);

/**
 * Subtract computation.
 */
var subtract = _operationComputation(subtractOperation);


/**
 * Multiply computation.
 */
var multiply = _operationComputation(multiplyOperation);


/**
 * Divide computation.
 */
var divide = _operationComputation(divideOperation);

/**
 * Remainder computation
 */
var remainder = _operationComputation(remainderOperation);

/**
 * Left shift computation
 */
var leftShift = _operationComputation(leftShiftOperation);

/**
 * Signed right shift computation
 */
var signedRightShift = _operationComputation(signedRightShiftOperation);

/**
 * Unsigned right shift computation
 */
var unsignedRightShift = _operationComputation(unsignedRightShiftOperation);

/* Unary Operation Computation
 ******************************************************************************/
var negate = function(argument) {
    return compute.bind(argument, function(x) {
        return compute.always(new Number(-x.value));
    });
};


/* Export
 ******************************************************************************/
return {
    'Number': Number,

// Binary Operations
    'addOperation': addOperation,
    'subtractOperation': subtractOperation,
    'multiplyOperation': multiplyOperation,
    'divideOperation': divideOperation,
    'remainderOperation': remainderOperation,
    
    'leftShiftOperation': leftShiftOperation,
    'signedRightShiftOperation': signedRightShiftOperation,
    'unsignedRightShiftOperation': unsignedRightShiftOperation,
    
// Binary Operation Computations
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide,
    'remainder': remainder,
    
    'leftShift': leftShift,
    'signedRightShift': signedRightShift,
    'unsignedRightShift': unsignedRightShift,
    
// Unary Operation Computations
    'negate': negate,
};

});