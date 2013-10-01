/**
 * @fileOverview Number operation computations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/value/number'],
function(exports,
        compute,
        fun,
        string,
        type_conversion,
        number) {
"use strict";

var _binaryOperation = function(op, leftType, rightType) {
    return function(left, right) {
        leftType = leftType || type_conversion.toNumber;
        rightType = rightType || type_conversion.toNumber;
        return compute.binary(
            compute.bind(left, leftType),
            compute.bind(right, rightType),
            compute.lift(op));
    };
};

var _unaryOperation = function(op, type) {
    return function(argument) {
        type = type || type_conversion.toNumber
        return compute.bind(
            compute.bind(argument, type),
            compute.lift(op));
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
var toExponential = compute.lift(number.toExponential);

var toFixed = compute.lift(number.toFixed);

var toPrecision = compute.lift(number.toPrecision);

/* Binary Operations
 ******************************************************************************/
var add = _binaryOperation(number.add);

var subtract = _binaryOperation(number.subtract);

var multiply = _binaryOperation(number.multiply);

var divide = _binaryOperation(number.divide);

var remainder = _binaryOperation(number.remainder);

/* Bitwise Operations
 ******************************************************************************/
var leftShift = _binaryOperation(number.leftShift, type_conversion.toInt32, type_conversion.toUint32);

var signedRightShift = _binaryOperation(number.signedRightShift, type_conversion.toInt32, type_conversion.toUint32);

var unsignedRightShift = _binaryOperation(number.unsignedRightShift, type_conversion.toInt32, type_conversion.toUint32);

var bitwiseAnd = _binaryOperation(number.bitwiseAnd, type_conversion.toInt32, type_conversion.toInt32);

var bitwiseXor = _binaryOperation(number.bitwiseXor, type_conversion.toInt32, type_conversion.toInt32);

var bitwiseOr = _binaryOperation(number.bitwiseOr, type_conversion.toInt32, type_conversion.toInt32);

/* Relational Binary Operations
 ******************************************************************************/
var eq = _binaryOperation(number.eq);

var lt = _binaryOperation(number.lt);

var lte = _binaryOperation(number.lte);

var gt = _binaryOperation(number.gt);

var gte = _binaryOperation(number.gte);

/* Unary Operations
 ******************************************************************************/
var negate = _unaryOperation(number.negate);

var bitwiseNot = _unaryOperation(number.bitwiseNot, type_conversion.toInt32);

/* Update Operation Computation
 ******************************************************************************/
var increment = fun.curry(add, compute.just(new number.Number(1)));

var decrement = fun.curry(add, compute.just(new number.Number(-1)));

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