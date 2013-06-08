/**
 * @fileOverview
 * 
 * These conversions do not handle object values.
 */
define(['atum/value/value',
        'atum/value/boolean', 'atum/value/string', 'atum/value/number',
        'atum/value/nil', 'atum/value/undef', 'atum/value/object',
        'atum/value/type'],
function(value,
        boolean, string, number,
        nil, undef, object,
        type) {
"use strict";

/* Helper functions
 ******************************************************************************/
var sign = function(num) {
    return (num ?
        (num < 0 ? -1 : 1):
        0);
};

/* Conversion
 ******************************************************************************/

/**
 * Converts value 'input' to a boolean.
 */
var toBoolean = function(input) {
    switch (value.type(input)) {
    case type.BOOLEAN_TYPE:
        return input;
    case type.NUMBER_TYPE:
        return new boolean.Boolean(input.value !== 0 && input.value !== NaN);
    case type.STRING_TYPE:
        return new boolean.Boolean(input.value.length > 0);
    case type.OBJECT_TYPE:
        return new boolean.Boolean(true);
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
    default:
        return new boolean.Boolean(false);
    }
};

/**
 * Converts value 'input' to a number.
 */
var toNumber = function(input) {
    switch (value.type(input)) {
    case type.UNDEFINED_TYPE:   return new number.Number(NaN);
    case type.NULL_TYPE:        return new number.Number(0);
    case type.BOOLEAN_TYPE:     return new number.Number(input.value ? 1 : 0);
    case type.NUMBER_TYPE:      return input;
    case type.STRING_TYPE:      return new number.Number(+input.value);
    default:                    return null;
    }
};

/**
 * Convert a number 'num' to an integer.
 */
var toInteger = function(input) {
    switch (input.value) {
    case NaN:
        return new number.Number(0);
    case 0:
    case Infinity:
    case -Infinity:
        return input;
    default:
        return new Number(sign(input.value) * Math.floor(Math.abs(input.value)));
    }
};

/**
 * Convert number 'num' to an signed 32bit integer.
 */
var toInt32 = function(num) {
    switch (num.value) {
    case NaN:
    case 0:
    case Infinity:
    case -Infinity:
        return new number.Number(0);
    default:
        var int32bit = (sign(num.value) * Math.floor(Math.abs(num.value))) % Math.pow(2, 32);
        return new number.Number(int32bit >= Math.pow(2, 31) ?
            int32bit - Math.pow(2, 32) :
            int32bit);
    }
};

/**
 * Convert number 'num' to an unsigned 32bit integer.
 */
var toUint32 = function(num) {
    switch (num.value) {
    case NaN:
    case 0:
    case Infinity:
    case -Infinity:
        return new number.Number(0);
    default:
        var int32bit = (sign(num.value) * Math.floor(Math.abs(num.value))) % Math.pow(2, 32);
        return new number.Number(int32bit);
    }
};

/**
 * Converts value 'input' to a string.
 */
var toString = function(input) {
    switch (value.type(input)) {
    case type.UNDEFINED_TYPE:   return new string.String("undefined");
    case type.NULL_TYPE:        return new string.String("null");
    case type.BOOLEAN_TYPE:     return new string.String(input.value ? 'true' : 'false');
    case type.NUMBER_TYPE:      return new string.String("" + input.value);
    case type.STRING_TYPE:      return input;
    default:                    return null;
    }
};

/* Export
 ******************************************************************************/
return {
    'toBoolean': toBoolean,
    'toNumber': toNumber,
    'toInteger': toInteger,
    'toInt32': toInt32,
    'toUint32': toUint32,
    'toString': toString
};

});