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
    case type.BOOLEAN:
        return input;
    case type.NUMBER:
        return boolean.Boolean.create(input.value !== 0 && input.value !== number.NaN.value);
    case type.STRING:
        return boolean.Boolean.create(input.value.length > 0);
    case type.UNDEFINED:
    case type.NULL:
    default:
        return boolean.FALSE;
    }
};

/**
 * Convert to a hosted number.
 */
var toNumber = function(input) {
    switch (value.type(input)) {
    case type.NUMBER:      return input;
    case type.UNDEFINED:   return number.NaN;
    case type.BOOLEAN:     return number.Number.create(input.value ? 1 : 0);
    case type.STRING:      return number.Number.create(+input.value);
    case type.NULL:
    default:               return number.ZERO;
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
        return number.Number.create(sign(val) * Math.floor(Math.abs(val)));
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
        return number.Number.create(int32bit >= Math.pow(2, 31) ?
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
        return number.Number.create(
            (sign(val) * Math.floor(Math.abs(val))) % Math.pow(2, 32));
    }
};

/**
 * Convert to a hosted string.
 */
var toString = function(input) {
    switch (value.type(input)) {
    case type.UNDEFINED:   return string.String.create("undefined");
    case type.NULL:        return string.String.create("null");
    case type.BOOLEAN:     return string.String.create(input.value ? 'true' : 'false');
    case type.NUMBER:      return string.String.create("" + input.value);
    case type.STRING:      return input;
    default:               return string.EMPTY;
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