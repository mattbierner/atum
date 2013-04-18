/**
 * @fileOverview Primitive string value and string operations.
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
        type) {
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
    this.value = (v || "");
};
String.prototype = new value.Value;

String.prototype.type = type.STRING_TYPE;

/* Operations
 ******************************************************************************/
/**
 * Joins two strings into a new string.
 * 
 * @return New primitive string value of string 'a' joined to string 'b'.
 */
var concat = function(a, b) {
    return new String(a.value + b.value);
};

/* Export
 ******************************************************************************/
return {
    'String': String,
    
    'concat': concat
};

});