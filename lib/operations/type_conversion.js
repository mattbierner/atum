/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/type_conversion',
        'atum/value/value'],
function(compute,
        value_reference,
        type,
        type_conversion,
        value) {
"use strict";

/* Computations
 ******************************************************************************/
/**
 * Computation that converts the result of computation 'input' to a primitive
 * value.
 */
var toPrimitive = function(input, preferredType) {
    return compute.bind(input, function(ref) {
        return compute.bind(value_reference.getValue(compute.just(ref)), function(x) {
            return (value.type(x) === type.OBJECT_TYPE ?
                x.defaultValue(ref, preferredType) :
                compute.just(x));
        });
    });
};

/**
 * Computation that converts the result of computation 'input' to a boolean.
 */
var toBoolean = function(input) {
    return compute.bind(value_reference.getValue(input), function(x) {
        return compute.just(type_conversion.toBoolean(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a number.
 */
var toNumber = function(input) {
    return compute.bind(toPrimitive(value_reference.getValue(input)), function(x) {
        return compute.just(type_conversion.toNumber(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toInteger = function(input) {
    return compute.bind(toNumber(input), function(x) {
        return compute.just(type_conversion.toInteger(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toInt32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.just(type_conversion.toInt32(num));
    });
};

/**
 * Computation that converts the result of computation 'input' to a integer.
 */
var toUint32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.just(type_conversion.toUint32(num));
    });
};

/**
 * Computation that converts the result of computation 'input' to a string.
 */
var toString = function(input) {
    return compute.bind(toPrimitive(input), function(x) {
       return compute.just(type_conversion.toString(x));
    });
};

/**
 * Computation that converts the result of computation 'input' to an object.
 * 
 * @TODO
 */
var toObject = function(input) {
    return compute.bind(value_reference.getValue(input), function(x) {
        switch (value.type(x))
        {
        case type.UNDEFINED_TYPE:
        case type.NULL_TYPE:
            return compute.error("TODO");
        case type.NUMBER_TYPE:
            var builtin_number = require('atum/builtin/number');
            return (new builtin_number.Number).construct([x]);
        
        }
        return compute.just(x);
    });
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