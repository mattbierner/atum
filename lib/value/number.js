/**
 * @fileOverview Primitive number value and number operations.
 */
define(['atum/value/boolean',
        'atum/value/string',
        'atum/value/type',
        'atum/value/value'],
function(boolean,
        string,
        type,
        value) {
"use strict";

/* NumberValue
 ******************************************************************************/
/**
 * Primitive number value.
 * 
 * @param {Number} [v] Value stored in the primitive number.
 */
var NumberValue = function(v) {
    value.Value.call(this);
    this.value = (v === undefined ? 0 : +v);
};
NumberValue.prototype = new value.Value;
NumberValue.prototype.constructor = NumberValue;

NumberValue.prototype.type = type.NUMBER;

/* Constants
 ******************************************************************************/
var ZERO = new NumberValue(0);

var MAX_VALUE = new NumberValue(Number.MAX_VALUE);

var MIN_VALUE = new NumberValue(Number.MIN_VALUE);

var NaN = new NumberValue(Number.NaN);

var NEGATIVE_INFINITY = new NumberValue(Number.NEGATIVE_INFINITY);

var POSITIVE_INFINITY = new NumberValue(Number.POSITIVE_INFINITY);


/* Numeric Conversion
 ******************************************************************************/
/**
 * @param x Number object.
 * @param {Number} precision Number of digits after the decimal point.
 */
var toExponential = function(x, fractionDigits) {
    return new string.String(Number.prototype.toExponential.call(x.value, fractionDigits));
};

/**
 * 
 * @param x Number object.
 * @param {Number} [fractionDigits] Number of digits after the decimal point.
 */
var toFixed = function(x, fractionDigits) {
    fractionDigits = (fractionDigits || 0);
    return new string.String(Number.prototype.toFixed.call(x.value, fractionDigits));
};

/**
 * 
 * @param x Number object.
 * @param {Number} precision Precision to convert to. Must be supplied.
 */
var toPrecision = function(x, precision) {
    return new string.String(Number.prototype.toPrecision.call(x.value, precision));
};

/* Binary Numeric Operations
 ******************************************************************************/
var add = function(l, r) { return new NumberValue(l.value + r.value); };

var subtract = function(l, r) { return new NumberValue(l.value - r.value); };

var multiply = function(l, r) { return new NumberValue(l.value * r.value); };

var divide = function(l, r) { return new NumberValue(l.value / r.value); };

var remainder = function(l, r) { return new NumberValue(l.value % r.value); };

/* Binary Bitwise Operations
 ******************************************************************************/
var leftShift = function(l, r) { return new NumberValue(l.value << r.value); };

var signedRightShift = function(l, r) { return new NumberValue(l.value >> r.value); };

var unsignedRightShift = function(l, r) { return new NumberValue(l.value >>> r.value); };

var bitwiseAnd = function(l, r) { return new NumberValue(l.value & r.value); };

var bitwiseOr = function(l, r) { return new NumberValue(l.value | r.value); };

var bitwiseXor = function(l, r) { return new NumberValue(l.value ^ r.value); };

/* Binary Relational Operations
 ******************************************************************************/
var lt = function(l, r) { return new boolean.Boolean(l.value < r.value); };

var lte = function(l, r) { return new boolean.Boolean(l.value <= r.value); };

var gt = function(l, r) { return new boolean.Boolean(l.value > r.value); };

var gte = function(l, r) { return new boolean.Boolean(l.value >= r.value); };

/* Unary Operations
 ******************************************************************************/
var negate = function(a) { return new NumberValue(-a.value); };

var bitwiseNot = function(a) { return new NumberValue(~a.value); };

/* Export
 ******************************************************************************/
return {
    'Number': NumberValue,

// Constants
    'ZERO': ZERO,
    'MAX_VALUE': MAX_VALUE,
    'MIN_VALUE': MIN_VALUE,
    'NaN': NaN,
    'NEGATIVE_INFINITY': NEGATIVE_INFINITY,
    'POSITIVE_INFINITY': POSITIVE_INFINITY,
    
// Numeric Conversion
    'toExponential': toExponential,
    'toFixed': toFixed,
    'toPrecision': toPrecision,
    
// Binary Numeric Operations
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide,
    'remainder': remainder,

// Binary Bitwise Operations
    'leftShift': leftShift,
    'signedRightShift': signedRightShift,
    'unsignedRightShift': unsignedRightShift,
    'bitwiseAnd': bitwiseAnd,
    'bitwiseOr': bitwiseOr,
    'bitwiseXor': bitwiseXor,

// Binary Relation Operations
    'lt': lt,
    'lte': lte,
    'gt': gt,
    'gte': gte,

// Unary Operations
    'negate': negate,
    'bitwiseNot': bitwiseNot
};

});