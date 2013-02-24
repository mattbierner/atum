define(['atum/compute', 'atum/value', 'atum/number'],
function(compute, value, number) {
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
        case 'Undefined':   return compute.always(false);
        case 'Null':        return compute.always(false);
        case 'Boolean':     return compute.always(x);
        case 'Number':      return compute.always(x.value === 0 || x.value === NaN);
        case 'String':      return compute.always(x.length > 0);
        case 'Object':      return toNumber(true);
        }
    });
};

/**
 * Computation that converts the result of computation 'input' to a number.
 */
var toNumber = function(input) {
    return compute.bind(input, function(x) {
        switch (value.type(x)) {
        case 'Undefined':   return compute.always(new number.Number(NaN));
        case 'Null':        return compute.always(new number.Number(0));
        case 'Boolean':     return compute.always(new number.Number(x.value ? 1 : 0));
        case 'Number':      return compute.always(x);
        case 'String':      return compute.always(new number.Number(x.toNumber()));
        case 'Object':      return toNumber(toPrimitive(x));
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



/* Export
 ******************************************************************************/
return {
    'toPrimitive': toPrimitive,
    'toBoolean': toBoolean,
    'toNumber': toNumber,
    'toInterger': toInterger,
    'toInt32': toInt32,
    'toUint32': toUint32
};

});