/**
 * @fileOverview Primitive string value and string operations.
 */
define(['atum/value/value',
        'atum/value/type',
        'atum/value/boolean'],
function(value,
        type,
        boolean) {
"use strict";

/* String
 ******************************************************************************/
/**
 * Primitive string value.
 * 
 * @param {string} [v] String value stored in the primitive.
 */
var String = function(v) {
    value.Value.call(this);
    this.value = (v === undefined ? '' : v + '');
};
String.prototype = new value.Value;

String.prototype.type = type.STRING_TYPE;

/* Constants
 ******************************************************************************/
var EMPTY = new String('');

/* Operations
 ******************************************************************************/
/**
 * Joins two strings into a new string.
 * 
 * @return New primitive string value of string 'a' joined to string 'b'.
 */
var concat = function(l, r) {
    return new String(l.value + r.value);
};

/* Relational
 ******************************************************************************/
/**
 * Are two strings equal.
 */
var eq = function(l, r) {
    return new boolean.Boolean(l.value === r.value); 
};

/* Export
 ******************************************************************************/
return {
    'String': String,
    
    'concat': concat
};

});