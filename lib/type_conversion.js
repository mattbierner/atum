define(['atum/compute',
        'atum/value', 'atum/boolean', 'atum/string', 'atum/number'],
function(compute,
        value, boolean, string, number) {
//"use strict";

var sign = function(val) {
    return (number ?
        (number < 0 ? -1 : 1):
        0);
};

/* Computations
 ******************************************************************************/
/**
 * Computation that converts the result of computation 'input' to a primitive
 * value.
 */
var toPrimitive = function(input, preferredType) {
    return compute.bind(input, function(x) {
        if (value.type(x) === "Object") {
            return compute.always(x.defaultValue(preferredType));
        }
        return compute.always(x);
    });
};

/**
 * Computation that converts the result of computation 'input' to a boolean.
 */
var toBoolean = function(input) {
    return compute.bind(input, function(x) {
        switch (value.type(x)) {
        case 'undefined':
        case 'null':
            return compute.always(new boolean.Boolean(false));
        case 'boolean':
            return compute.always(x);
        case 'number':
            return compute.always(new boolean.Boolean(x.value !== 0 && x.value !== NaN));
        case 'string':
            return compute.always(new boolean.Boolean(x.value.length > 0));
        case 'object':
            return compute.always(new boolean.Boolean(true));
        }
    });
};

/**
 * Computation that converts the result of computation 'input' to a number.
 */
var toNumber = function(input) {
    return compute.bind(input, function(x) {
        switch (value.type(x)) {
        case 'undefined':   return compute.always(new number.Number(NaN));
        case 'null':        return compute.always(new number.Number(0));
        case 'moolean':     return compute.always(new number.Number(x.value ? 1 : 0));
        case 'number':      return compute.always(x);
        case 'string':      return compute.always(new number.Number(+x));
        case 'object':      return toNumber(toPrimitive(x));
        }
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toInterger = function(input) {
    return compute.bind(toNumber(input), function(x) {
        switch (x.value) {
        case NaN:
            return compute.always(new number.Number(0));
        case 0:
        case Infinity:
        case -Infinity:
            return compute.always(x);
        default:
            return compute.always(new Number(sign(x.value) * Math.floor(Math.abs(x.value))));
        }
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toInt32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
        switch (num.value) {
        case NaN:
        case 0:
        case Infinity:
        case -Infinity:
            return compute.always(new number.Number(0));
        default:
            var int32bit = (sign(num.value) * Math.floor(Math.abs(num.value))) % Math.pow(2, 32);
            return compute.always(new number.Number(int32bit >= Math.pow(2, 31) ?
                int32bit - Math.pow(2, 32) :
                int32bit));
        }
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toUint32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
        switch (num.value) {
        case NaN:
        case 0:
        case Infinity:
        case -Infinity:
            return compute.always(new number.Number(0));
        default:
            var int32bit = (sign(num.value) * Math.floor(Math.abs(num.value))) % Math.pow(2, 32);
            return compute.always(new number.Number(int32bit));
        }
    });
};

/**
 * Computation that converts the result of computation 'input' to a string.
 */
var toString = function(input) {
    return compute.bind(input, function(x) {
        switch (value.type(x)) {
        case 'undefined':   return compute.always(new string.String("undefined"));
        case 'null':        return compute.always(new string.String(null));
        case 'boolean':     return compute.always(new string.String(x.value ? 'true' : 'false'));
        case 'number':      return compute.always(new string.String("" + x.value));
        case 'string':      return compute.always(x);
        case 'object':      return toString(toPrimitive(x, "string"));
        }
    });
};

/**
 * Computation that converts the result of computation 'input' to an object.
 */
var toObject = function(input) {
    return compute.bind(input, function(x) {
        switch (value.type(x)) {
        case 'undefined':
        case 'null':
            return compute.never("Cannot convert toObject");
        case 'boolean':     return compute.always(new string.String(x.value ? 'true' : 'false'));
        case 'number':      return compute.always(new string.String("" + x.value));
        case 'string':      return compute.always(x);
        case 'object':      return toString(toPrimitive(x, "string"));
        }
    });
};

/* Export
 ******************************************************************************/
return {
    'toPrimitive': toPrimitive,
    'toBoolean': toBoolean,
    'toNumber': toNumber,
    'toInterger': toInterger,
    'toInt32': toInt32,
    'toUint32': toUint32,
    'toString': toString
};

});