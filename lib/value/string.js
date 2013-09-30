/**
 * @fileOverview Primitive string value and string operations.
 */
define(['exports',
        'atum/value/number',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        number,
        type,
        value) {
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
String.prototype.constructor = String;

String.prototype.type = type.STRING;

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

/**
 * Get the character at `index` in string `s`
 * 
 * Index must be lt the length of the string.
 * 
 * @param s Hosted string value.
 * @param {Number} index
 * 
 * @return Hosted string of the character.
 */
var charAt = function(s, index) {
    return new String(s.value.charAt(index));
};

/**
 * Get the character code of the character at `index` in string `s`
 * 
 * Index must be lt the length of the string.
 * 
 * @param s Hosted string value.
 * @param {Number} index
 * 
 * @return Hosted number of the character
 */
var charCodeAt = function(s, index) {
    return new number.Number(s.value.charCodeAt(index));
};

var indicies = function(s) {
    var names = [];
    for (var i = 0; i < s.value.length; ++i)
        names.push(i + '');
    return names;
};

var length = function(s) {
    return new number.Number(s.value.length);
};

/* Export
 ********************************************************************** ********/
exports.String = String;

// Constants
exports.EMPTY = EMPTY;

// Operations
exports.concat = concat;
exports.charAt = charAt;
exports.charCodeAt = charCodeAt;
exports.indicies = indicies;
exports.length = length;

});