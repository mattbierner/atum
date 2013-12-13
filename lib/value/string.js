/**
 * @fileOverview Primitive string value and string operations.
 */
define(['exports',
        'amulet/record',
        'atum/value/number',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        record,
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
var String = record.extend(value.Value, [
    'value'],
    function(v) {
        this.value = (v === undefined ? '' : v + '');
    });

String.prototype.type = type.STRING;

/* Constants
 ******************************************************************************/
var EMPTY = String.create('');

/* Operations
 ******************************************************************************/
/**
 * Joins two strings into a new string.
 * 
 * @return New primitive string value of string 'a' joined to string 'b'.
 */
var concat = function(l, r) {
    return String.create(l.value + r.value);
};

/**
 * Get the length of a string.
 * 
 * @param s Hosted string value.
 * 
 * @return Hosted number.
 */
var length = function(s) {
    return number.Number.create(s.value.length);
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
    return String.create(s.value.charAt(index));
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
    return number.Number.create(s.value.charCodeAt(index));
};

var indicies = function(s) {
    var names = [];
    for (var i = 0; i < s.value.length; ++i)
        names.push(i + '');
    return names;
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