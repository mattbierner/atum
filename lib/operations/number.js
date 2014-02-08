/**
 * @fileOverview Number operation computations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/operations/type_conversion',
        'atum/value/number'],
function(exports,
        compute,
        fun,
        type_conversion,
        number) {
"use strict";

var _binaryOperation = function(op, leftType, rightType) {
    op = compute.from(op);
    leftType = leftType || type_conversion.toNumber;
    rightType = rightType || type_conversion.toNumber;

    return function(left, right) {
        return compute.binary(
            leftType(left),
            rightType(right),
            op);
    };
};

var _unaryOperation = function(op, type) {
    return compute.compose(
        (type || type_conversion.toNumber),
        compute.from(op));
};

/* Creation
 ******************************************************************************/
/**
 * Create a hosted number value.
 * 
 * @param {number} value Host language value for hosted number.
 */
exports.create = compute.from(number.Number.create);

/**
 * Create a new hosted number value from the results of a computation.
 */
exports.from = compute.lift(number.Number.create);

/* Constants
 ******************************************************************************/
exports.NAN = compute.just(number.NaN);

/* Host Operations
 ******************************************************************************/
/**
 * Computation resulting in host number of a number value.
 */
exports.toHost = compute.compose(
    type_conversion.toNumber,
    function(x) {
        return compute.just(x.value);
    });

/* Numeric Conversion
 ******************************************************************************/
exports.toExponential = compute.from(number.toExponential);

exports.toFixed = compute.from(number.toFixed);

exports.toPrecision = compute.from(number.toPrecision);

/* Binary Operations
 ******************************************************************************/
var add = _binaryOperation(number.add);
exports.add = add;

exports.subtract = _binaryOperation(number.subtract);

exports.multiply = _binaryOperation(number.multiply);

exports.divide = _binaryOperation(number.divide);

exports.remainder = _binaryOperation(number.remainder);

/* Bitwise Operations
 ******************************************************************************/
exports.leftShift = _binaryOperation(number.leftShift,
    type_conversion.toInt32,
    type_conversion.toUint32);

exports.signedRightShift = _binaryOperation(number.signedRightShift,
    type_conversion.toInt32,
    type_conversion.toUint32);

exports.unsignedRightShift = _binaryOperation(number.unsignedRightShift,
    type_conversion.toInt32,
    type_conversion.toUint32);

exports.bitwiseAnd = _binaryOperation(number.bitwiseAnd,
    type_conversion.toInt32,
    type_conversion.toInt32);

exports.bitwiseXor = _binaryOperation(number.bitwiseXor,
    type_conversion.toInt32, 
    type_conversion.toInt32);

exports.bitwiseOr = _binaryOperation(number.bitwiseOr,
    type_conversion.toInt32,
    type_conversion.toInt32);

/* Relational Binary Operations
 ******************************************************************************/
exports.lt = _binaryOperation(number.lt);

exports.lte = _binaryOperation(number.lte);

exports.gt = _binaryOperation(number.gt);

exports.gte = _binaryOperation(number.gte);

/* Unary Operations
 ******************************************************************************/
exports.negate = _unaryOperation(number.negate);

exports.bitwiseNot = _unaryOperation(number.bitwiseNot, type_conversion.toInt32);

/* Update Operation Computation
 ******************************************************************************/
exports.increment = fun.curry(add, new number.Number(1));

exports.decrement = fun.curry(add, new number.Number(-1));

});