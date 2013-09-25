/**
 * @fileOverview Number operation computations.
 */
define(['exports',
        'atum/compute',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/value/number'],
function(exports,
        compute,
        string,
        type_conversion,
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

/* Constants
 ******************************************************************************/
var NAN = compute.just(number.NaN);

/* Numeric Conversion
 ******************************************************************************/
var toExponential = function(x, fractionDigits) {
    return compute.just(number.toExponential(x, fractionDigits));
};

var toFixed = function(x, fractionDigits) {
    return compute.just(number.toFixed(x, fractionDigits));
};

var toPrecision = function(x, precision) {
    return compute.just(number.toPrecision(x, precision));
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
var _relationalOperator = function(op) {
    return function(left, right) {
        return compute.binary(
            compute.bind(left, type_conversion.toNumber),
            compute.bind(right, type_conversion.toNumber),
            function(l, r) {
                return compute.just(op(l, r));
            });
    };
};

var eq = _relationalOperator(number.eq);

var lt = _relationalOperator(number.lt);

var lte = _relationalOperator(number.lte);

var gt = _relationalOperator(number.gt);

var gte = _relationalOperator(number.gte);

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
// Creation
exports.create = create;

// Constants
exports.NAN = NAN;

// Numeric Conversion
exports.toExponential = toExponential;
exports.toFixed = toFixed;
exports.toPrecision = toPrecision;

// Binary Operations
exports.add = add;
exports.subtract = subtract;
exports.multiply = multiply;
exports.divide = divide;
exports.remainder = remainder;

// Bitwise Operations
exports.leftShift = leftShift;
exports.signedRightShift = signedRightShift;
exports.unsignedRightShift = unsignedRightShift;
exports.bitwiseAnd = bitwiseAnd;
exports.bitwiseXor = bitwiseXor;
exports.bitwiseOr = bitwiseOr;

// Binary Relational Operations
exports.eq = eq;
exports.lt = lt;
exports.lte = lte;
exports.gt = gt;
exports.gte = gte;

// Unary Operations
exports.negate = negate;
exports.bitwiseNot = bitwiseNot;

// Update Operations
exports.increment = increment;
exports.decrement = decrement;

});