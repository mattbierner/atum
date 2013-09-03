/**
 * @fileOverview Type conversion computations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/boolean',
        'atum/builtin/number',
        'atum/builtin/string',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/type_conversion',
        'atum/value/value'],
function(exports,
        compute,
        builtin_boolean,
        builtin_number,
        builtin_string,
        boolean,
        error,
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
 * @param input Value to convert.
 * @param {string} [preferredType] Hint for type to convert to.
 */
var toPrimitive = function(input, preferredType) {
    return compute.bind(value_reference.getValue(compute.just(input)), function(x) {
        return (value.isObject(x) ?
            x.defaultValue(input, preferredType) :
            compute.just(x));
    });
};

/**
 * Convert to a boolean.
 * 
 * @param input Value to convert.
 */
var toBoolean = function(input) {
    return compute.bind(value_reference.getValue(compute.just(input)), function(x) {
        return (value.isObject(x) ?
            boolean.TRUE :
            compute.just(type_conversion.toBoolean(x)));
    });
};

/**
 * Converts to a number.
 * 
 * @param input Value to convert.
 */
var toNumber = function(input) {
    return compute.bind(toPrimitive(input, 'Number'), function(x) {
        return compute.just(type_conversion.toNumber(x));
    });
};

/**
 * Convert to an integer.
 * 
 * @param input Value to convert.
 */
var toInteger = function(input) {
    return compute.bind(toNumber(input), function(x) {
        return compute.just(type_conversion.toInteger(x));
    });
};

/**
 * Convert to a signed 32 bit integer.
 * 
 * @param input Value to convert.
 */
var toInt32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.just(type_conversion.toInt32(num));
    });
};

/**
 * Convert to an unsigned 32 bit integer.
 * 
 * @param input Value to convert.
 */
var toUint32 = function(input) {
    return compute.bind(toNumber(input), function(num) {
       return compute.just(type_conversion.toUint32(num));
    });
};

/**
 * Convert to a string.
 * 
 * @param input Value to convert.
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
 * @param input Value to convert.
 */
var toObject = function(input) {
    return compute.bind(
        value_reference.getValue(compute.just(input)),
        function(v) {
            switch (value.type(v))
            {
            case type.UNDEFINED_TYPE:
            case type.NULL_TYPE:
                return error.typeError();
                
            case type.NUMBER_TYPE:
                return object_operations.construct(
                    compute.just(builtin_number.Number),
                    compute.enumeration(compute.just(input)));
                
            case type.BOOLEAN_TYPE:
                return object_operations.construct(
                    compute.just(builtin_boolean.Boolean),
                    compute.enumeration(compute.just(input)));
            
            case type.STRING_TYPE:
                return object_operations.construct(
                    compute.just(builtin_string.String),
                    compute.enumeration(compute.just(input)));
            }
            return compute.just(input);
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