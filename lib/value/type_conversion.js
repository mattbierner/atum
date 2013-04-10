define(['atum/value/value',
        'atum/value/boolean', 'atum/value/string', 'atum/value/number',
        'atum/value/nil', 'atum/value/undef', 'atum/value/object'],
function(value,
        boolean, string, number,
        nil, undef, object) {
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
 * Converts value 'input' to a primitive value.
 */
var toPrimitive = function(input, preferredType) {
    return (value.type(input) === object.OBJECT_TYPE ?
        input.defaultValue(preferredType) :
        input);
};

/**
 * Converts value 'input' to a boolean.
 */
var toBoolean = function(input) {
    switch (value.type(input)) {
    case boolean.BOOLEAN_TYPE:
        return input;
    case number.NUMBER_TYPE:
        return new boolean.Boolean(input.value !== 0 && input.value !== NaN);
    case string.STRING_TYPE:
        return new boolean.Boolean(input.value.length > 0);
    case object.OBJECT_TYPE:
        return new boolean.Boolean(true);
    case undef.UNDEFINED_TYPE:
    case nil.NULL_TYPE:
    default:
        return new boolean.Boolean(false);
    }
};

/**
 * Converts value 'input' to a number.
 */
var toNumber = function(input) {
    switch (value.type(input)) {
    case undef.UNDEFINED_TYPE:      return new number.Number(NaN);
    case nil.NULL_TYPE:             return new number.Number(0);
    case boolean.BOOLEAN_TYPE:      return new number.Number(input.value ? 1 : 0);
    case number.NUMBER_TYPE:        return input;
    case string.STRING_TYPE:        return new number.Number(+input.value);
    case object.OBJECT_TYPE:
    default:
        return toNumber(toPrimitive(input));
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
    case undef.UNDEFINED_TYPE:      return new string.String("undefined");
    case nil.NULL_TYPE:             return new string.String("null");
    case boolean.BOOLEAN_TYPE:      return new string.String(input.value ? 'true' : 'false');
    case number.NUMBER_TYPE:        return new string.String("" + input.value);
    case string.STRING_TYPE:        return input;
    case object.OBJECT_TYPE:        return toString(toPrimitive(input, "string"));
    }
};

/**
 * Convert value 'input' to an object.
 */
var toObject = function(input) {
    switch (value.type(input)) {
    case boolean.BOOLEAN_TYPE:
    case number.NUMBER_TYPE:
    case string.STRING_TYPE:
    case object.OBJECT_TYPE:
        return input;
    case undef.UNDEFINED_TYPE:
    case nil.NULL_TYPE:
    default:
        return null;
    }
};

/* Export
 ******************************************************************************/
return {
    'toPrimitive': toPrimitive,
    'toBoolean': toBoolean,
    'toNumber': toNumber,
    'toInteger': toInteger,
    'toInt32': toInt32,
    'toUint32': toUint32,
    'toString': toString,
    'toObject': toObject
};

});