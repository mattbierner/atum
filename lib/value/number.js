/**
 * @fileOverview Primitive Number value and operations that can be performed on it.
 */
define(['atum/compute',
        'atum/value/value'],
function(compute,
        value) {
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
var add = function(l, r) { return new Number(l.value + r.value); };

var subtract = function(l, r) { return new Number(l.value - r.value); };

var multiply = function(l, r) { return new Number(l.value * r.value); };

var divide = function(l, r) { return new Number(l.value / r.value); };

var remainder = function(l, r) { return new Number(l.value % r.value); };

var leftShift = function(l, r) { return new Number(l.value << r.value); };

var signedRightShift = function(l, r) { return new Number(l.value >> r.value); };

var unsignedRightShift = function(l, r) { return new Number(l.value >>> r.value); };

var bitwiseAnd = function(l, r) { return new Number(l.value & r.value); };

var bitwiseOr = function(l, r) { return new Number(l.value | r.value); };

var bitwiseXor = function(l, r) { return new Number(l.value ^ r.value); };

/* Unary Operations
 ******************************************************************************/
var negate = function(a) { return new Number(-a.value); };

var bitwiseNot = function(a) { return new Number(~a.value); };


/* Export
 ******************************************************************************/
return {
    'Number': Number,

// Binary Operations
    'add': add,
    'subtract': subtract,
    'multiply': multiply,
    'divide': divide,
    'remainder': remainder,
    
    'leftShift': leftShift,
    'signedRightShift': signedRightShift,
    'unsignedRightShift': unsignedRightShift,
    'bitwiseAnd': bitwiseAnd,
    'bitwiseOr': bitwiseOr,
    'bitwiseXor': bitwiseXor,
    
// Unary Operations
    'negate': negate,
    'bitwiseNot': bitwiseNot
};

});