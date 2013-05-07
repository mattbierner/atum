/**
 * @fileOverview Primitive Number value and number operations.
 */
define(['atum/value/value',
        'atum/value/boolean',
        'atum/value/type'],
function(value,
        boolean,
        type) {
"use strict";

/* Number
 ******************************************************************************/
/**
 * Primitive number value.
 * 
 * @param {Number} [v] Number value stored in primitive number.
 */
var Number = function(v) {
    value.Value.call(this);
    this.value = (v === undefined ? 0 : v);
};
Number.prototype = new value.Value;

Number.prototype.type = type.NUMBER_TYPE;

/* Binary Numeric Operations
 ******************************************************************************/
var add = function(l, r) { return new Number(l.value + r.value); };

var subtract = function(l, r) { return new Number(l.value - r.value); };

var multiply = function(l, r) { return new Number(l.value * r.value); };

var divide = function(l, r) { return new Number(l.value / r.value); };

var remainder = function(l, r) { return new Number(l.value % r.value); };

/* Binary Bitwise Operations
 ******************************************************************************/
var leftShift = function(l, r) { return new Number(l.value << r.value); };

var signedRightShift = function(l, r) { return new Number(l.value >> r.value); };

var unsignedRightShift = function(l, r) { return new Number(l.value >>> r.value); };

var bitwiseAnd = function(l, r) { return new Number(l.value & r.value); };

var bitwiseOr = function(l, r) { return new Number(l.value | r.value); };

var bitwiseXor = function(l, r) { return new Number(l.value ^ r.value); };

/* Binary Relational Operations
 ******************************************************************************/
var eq = function(l, r) {
    return new boolean.Boolean(l.value !== NaN && r.value !== NaN && l.value === r.value);
};

var lt = function(l, r) { return new boolean.Boolean(l.value < r.value); };

var lte = function(l, r) { return new boolean.Boolean(l.value <= r.value); };

var gt = function(l, r) { return new boolean.Boolean(l.value > r.value); };

var gte = function(l, r) { return new boolean.Boolean(l.value >= r.value); };

/* Unary Operations
 ******************************************************************************/
var negate = function(a) { return new Number(-a.value); };

var bitwiseNot = function(a) { return new Number(~a.value); };


/* Export
 ******************************************************************************/
return {
    'Number': Number,

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
    'eq': eq,
    'lt': lt,
    'lte': lte,
    'gt': gt,
    'gte': gte,

// Unary Operations
    'negate': negate,
    'bitwiseNot': bitwiseNot
};

});