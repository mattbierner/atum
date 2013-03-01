/**
 * 
 */
define(['atum/compute',
        'atum/value/type_conversion'],
function(compute,
        type_conversion) {
//"use strict";


/* Computations
 ******************************************************************************/
/**
 * Computation that converts the result of computation 'input' to a primitive
 * value.
 */
var toPrimitive = function(input, preferredType) {
    return compute.bind(input, function(x) {
        return compute.always(type_conversion.toPrimitive(x, preferredType));
    });
};

/**
 * Computation that converts the result of computation 'input' to a boolean.
 */
var toBoolean = function(input) {
    return compute.bind(input, function(x) {
        return compute.always(type_conversion.toBoolean(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a number.
 */
var toNumber = function(input) {
    return compute.bind(input, function(x) {
        return compute.always(type_conversion.toNumber(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toInterger = function(input) {
    return compute.bind(toNumber(input), function(x) {
        return compute.always(type_conversion.toInterger(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toInt32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.always(type_conversion.toInt32(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toUint32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.always(type_conversion.toUint32(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a string.
 */
var toString = function(input) {
    return compute.bind(input, function(x) {
       return compute.always(type_conversion.toString(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to an object.
 */
var toObject = function(input) {
    return compute.bind(input, function(x) {
        return compute.always(type_conversion.toObjectt(x));
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