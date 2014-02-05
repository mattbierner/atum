/**
 * @fileOverview Primitive number value and number operations.
 */
var HostNumber = Number;

define(['bes/record',
        'atum/value/boolean',
        'atum/value/string',
        'atum/value/type',
        'atum/value/value'],
function(record,
        boolean,
        string,
        type,
        value) {
"use strict";

/* Number
 ******************************************************************************/
/**
 * Primitive number value.
 * 
 * @param {Number} [v] Value stored in the primitive number.
 */
var Number = record.extend(value.Value, [
    'value'],
    function(v) {
        this.value = (v === undefined ? 0 : +v);
    });

Number.prototype.type = type.NUMBER;

/* Constants
 ******************************************************************************/
var ZERO = Number.create(0);

var MAX_VALUE = Number.create(HostNumber.MAX_VALUE);

var MIN_VALUE = Number.create(HostNumber.MIN_VALUE);

var NaN = Number.create(HostNumber.NaN);

var NEGATIVE_INFINITY = Number.create(HostNumber.NEGATIVE_INFINITY);

var POSITIVE_INFINITY = Number.create(HostNumber.POSITIVE_INFINITY);

/* Numeric Conversion
 ******************************************************************************/
/**
 * @param x Number object.
 * @param {Number} precision Number of digits after the decimal point.
 */
var toExponential = function(x, fractionDigits) {
    return string.String.create(HostNumber.prototype.toExponential.call(x.value, fractionDigits));
};

/**
 * 
 * @param x Number object.
 * @param {Number} [fractionDigits] Number of digits after the decimal point.
 */
var toFixed = function(x, fractionDigits) {
    fractionDigits = (fractionDigits || 0);
    return string.String.create(HostNumber.prototype.toFixed.call(x.value, fractionDigits));
};

/**
 * 
 * @param x Number object.
 * @param {Number} precision Precision to convert to. Must be supplied.
 */
var toPrecision = function(x, precision) {
    return string.String.create(HostNumber.prototype.toPrecision.call(x.value, precision));
};

/* Binary Numeric Operations
 ******************************************************************************/
var add = function(l, r) { return Number.create(l.value + r.value); };

var subtract = function(l, r) { return Number.create(l.value - r.value); };

var multiply = function(l, r) { return Number.create(l.value * r.value); };

var divide = function(l, r) { return Number.create(l.value / r.value); };

var remainder = function(l, r) { return Number.create(l.value % r.value); };

/* Binary Bitwise Operations
 ******************************************************************************/
var leftShift = function(l, r) { return Number.create(l.value << r.value); };

var signedRightShift = function(l, r) { return Number.create(l.value >> r.value); };

var unsignedRightShift = function(l, r) { return Number.create(l.value >>> r.value); };

var bitwiseAnd = function(l, r) { return Number.create(l.value & r.value); };

var bitwiseOr = function(l, r) { return Number.create(l.value | r.value); };

var bitwiseXor = function(l, r) { return Number.create(l.value ^ r.value); };

/* Binary Relational Operations
 ******************************************************************************/
var lt = function(l, r) { return boolean.create(l.value < r.value); };

var lte = function(l, r) { return boolean.create(l.value <= r.value); };

var gt = function(l, r) { return boolean.create(l.value > r.value); };

var gte = function(l, r) { return boolean.create(l.value >= r.value); };

/* Unary Operations
 ******************************************************************************/
var negate = function(a) { return Number.create(-a.value); };

var bitwiseNot = function(a) { return Number.create(~a.value); };

/* Export
 ******************************************************************************/
return {
    'Number': Number,

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