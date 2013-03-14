define(['atum/value/value',
        'atum/value/boolean', 'atum/value/string', 'atum/value/number'],
function(value,
        boolean, string, number) {
//"use strict";

var sign = function(val) {
    return (val ?
        (val < 0 ? -1 : 1):
        0);
};

/* Computations
 ******************************************************************************/
/**
 * Converts value 'input' to a primitive value.
 */
var toPrimitive = function(input, preferredType) {
    return (value.type(input) === "object" ?
        input.defaultValue(preferredType) :
        input);
};

/**
 * Converts value 'input' to a boolean.
 */
var toBoolean = function(input) {
    switch (value.type(input)) {
    case 'boolean':
        return input;
    case 'number':
        return new boolean.Boolean(input.value !== 0 && input.value !== NaN);
    case 'string':
        return new boolean.Boolean(input.value.length > 0);
    case 'object':
        return new boolean.Boolean(true);
    case 'undefined':
    case 'null':
    default:
        return new boolean.Boolean(false);
    }
};

/**
 * Computation that converts the result of computation 'input' to a number.
 */
var toNumber = function(input) {
    switch (value.type(input)) {
    case 'undefined':   return new number.Number(NaN);
    case 'null':        return new number.Number(0);
    case 'boolean':     return new number.Number(input.value ? 1 : 0);
    case 'number':      return input;
    case 'string':      return new number.Number(+input);
    case 'object':
    default:
        return toNumber(toPrimitive(input));
    }
};

/**
 * Convert number 'num' to an integer.
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
    case 'undefined':   return new string.String("undefined");
    case 'null':        return new string.String(null);
    case 'boolean':     return new string.String(input.value ? 'true' : 'false');
    case 'number':      return new string.String("" + input.value);
    case 'string':      return input;
    case 'object':      return toString(toPrimitive(input, "string"));
    }
};

/**
 * Convert value 'input' to an object.
 */
var toObject = function(input) {
    switch (value.type(input)) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'object':
        return input;
    case 'undefined':
    case 'null':
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
    'toString': toString
};

});