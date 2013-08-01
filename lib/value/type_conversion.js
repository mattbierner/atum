/**
 * @fileOverview Value type conversion logic.
 * 
 * These conversions only handle primitive types, not objects.
 * 'atum/operations/type_conversion' exposes computations that also handle
 * object values.
 */
define(['atum/value/boolean',
        'atum/value/nil',
        'atum/value/number',
        'atum/value/object',
        'atum/value/string',
        'atum/value/type',
        'atum/value/undef',
        'atum/value/value'],
function(boolean,
        nil,
        number,
        object,
        string,
        type,
        undef,
        value) {
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
 * Convert to a hosted boolean.
 */
var toBoolean = function(input) {
    switch (value.type(input)) {
    case type.BOOLEAN_TYPE:
        return input;
    case type.NUMBER_TYPE:
        return new boolean.Boolean(input.value !== 0 && input.value !== number.NaN.value);
    case type.STRING_TYPE:
        return new boolean.Boolean(input.value.length > 0);
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
    default:
        return boolean.FALSE;
    }
};

/**
 * Convert to a hosted number.
 */
var toNumber = function(input) {
    switch (value.type(input)) {
    case type.UNDEFINED_TYPE:   return number.NaN;
    case type.NULL_TYPE:        return number.ZERO;
    case type.BOOLEAN_TYPE:     return new number.Number(input.value ? 1 : 0);
    case type.NUMBER_TYPE:      return input;
    case type.STRING_TYPE:      return new number.Number(+input.value);
    default:                    return number.ZERO;
    }
};

/**
 * Convert a number to a hosted integer.
 * 
 * @param input Hosted number value.
 */
var toInteger = function(input) {
    var val = input.value;
    switch (val) {
    case number.NaN.value:
        return number.ZERO;
    case number.ZERO.value:
    case number.POSITIVE_INFINITY.value:
    case number.NEGATIVE_INFINITY.value:
        return input;
    default:
        return new number.Number(sign(val) * Math.floor(Math.abs(val)));
    }
};

/**
 * Convert a number to a hosted signed 32bit integer.
 * 
 * @param input Hosted number value.
 */
var toInt32 = function(num) {
    var val = num.value;
    switch (val) {
    case number.NaN.value:
    case number.ZERO.value:
    case number.POSITIVE_INFINITY.value:
    case number.NEGATIVE_INFINITY.value:
        return number.ZERO;
    default:
        var int32bit = (sign(val) * Math.floor(Math.abs(val))) % Math.pow(2, 32);
        return new number.Number(int32bit >= Math.pow(2, 31) ?
            int32bit - Math.pow(2, 32) :
            int32bit);
    }
};

/**
 * Convert a number to a hosted unsigned 32bit integer.
 * 
 * @param input Hosted number value.
 */
var toUint32 = function(num) {
    var val = num.value;
    switch (val) {
    case number.NaN.value:
    case number.ZERO.value:
    case number.POSITIVE_INFINITY.value:
    case number.NEGATIVE_INFINITY.value:
        return number.ZERO;
    default:
        return new number.Number(
            (sign(val) * Math.floor(Math.abs(val))) % Math.pow(2, 32));
    }
};

/**
 * Convert to a hosted string.
 */
var toString = function(input) {
    switch (value.type(input)) {
    case type.UNDEFINED_TYPE:   return new string.String("undefined");
    case type.NULL_TYPE:        return new string.String("null");
    case type.BOOLEAN_TYPE:     return new string.String(input.value ? 'true' : 'false');
    case type.NUMBER_TYPE:      return new string.String("" + input.value);
    case type.STRING_TYPE:      return input;
    default:                    return string.EMPTY;
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