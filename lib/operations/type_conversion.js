/**
 * @fileOverview Type conversion computations.
 */
define(['exports',
        'atum/compute',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/type_conversion',
        'atum/value/value'],
function(exports,
        compute,
        object_operations,
        value_reference,
        type,
        type_conversion,
        value) {
"use strict";

/* Conversions
 ******************************************************************************/
/**
 * Convert to a primitive value.
 * 
 * @param input Computation of value to convert.
 * @param {string} [preferredType] Hint for type to convert to.
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
 * Convert to a boolean.
 * 
 * @param input Computation of value to convert.
 */
var toBoolean = function(input) {
    return compute.bind(value_reference.getValue(input), function(x) {
        return compute.just(type_conversion.toBoolean(x));
    });
};

/**
 * Converts to a number.
 * 
 * @param input Computation of value to convert.
 */
var toNumber = function(input) {
    return compute.bind(toPrimitive(input), function(x) {
        return compute.just(type_conversion.toNumber(x));
    });
};

/**
 * Convert to an integer.
 * 
 * @param input Computation of value to convert.
 */
var toInteger = function(input) {
    return compute.bind(toNumber(input), function(x) {
        return compute.just(type_conversion.toInteger(x));
    });
};

/**
 * Convert to a signed 32 bit integer.
 * 
 * @param input Computation of value to convert.
 */
var toInt32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.just(type_conversion.toInt32(num));
    });
};

/**
 * Convert to an unsigned 32 bit integer.
 * 
 * @param input Computation of value to convert.
 */
var toUint32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.just(type_conversion.toUint32(num));
    });
};

/**
 * Convert to a string.
 * 
 * @param input Computation of value to convert.
 */
var toString = function(input) {
    return compute.bind(toPrimitive(input), function(x) {
       return compute.just(type_conversion.toString(x));
    });
};

/**
 * Convert to an object.
 * 
 * @TODO Support other primitive types, return correct errors.
 * 
 * @param input Computation of value to convert.
 */
var toObject = function(input) {
    return compute.bind(value_reference.getValue(input), function(x) {
        switch (value.type(x))
        {
        case type.UNDEFINED_TYPE:
        case type.NULL_TYPE:
            return compute.error("TODO");
        case type.NUMBER_TYPE:
                var object_operations = require('atum/operations/object');

            var builtin_number = require('atum/builtin/number');
            return object_operations.construct(compute.just(builtin_number.Number), compute.sequence(compute.just(x)));
        
        }
        return compute.just(x);
    });
};

/* Export
 ******************************************************************************/
exports.toPrimitive = toPrimitive;
exports.toBoolean = toBoolean;
exports.toNumber = toNumber;
exports.toInteger = toInteger;
exports.toInt32 = toInt32;
exports.toUint32 = toUint32;
exports.toString = toString;
exports.toObject = toObject;

});