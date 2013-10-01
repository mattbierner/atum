/**
 * @fileOverview Type conversion operations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/boolean',
        'atum/builtin/number',
        'atum/builtin/regexp',
        'atum/builtin/string',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/type_conversion',
        'atum/value/value'],
function(exports,
        compute,
        builtin_boolean,
        builtin_number,
        builtin_regexp,
        builtin_string,
        boolean,
        error,
        string,
        object,
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
    return value_reference.dereference(input, function(x) {
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
    return value_reference.dereference(input, function(x) {
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
    return compute.bind(
        toPrimitive(input, type.NUMBER),
        compute.lift(type_conversion.toNumber));
};

/**
 * Convert to an integer.
 * 
 * @param input Value to convert.
 */
var toInteger = function(input) {
    return compute.bind(
        toNumber(input),
        compute.lift(type_conversion.toInteger));
};

/**
 * Convert to a signed 32 bit integer.
 * 
 * @param input Value to convert.
 */
var toInt32 = function(input) {
    return compute.bind(
        toNumber(input),
        compute.lift(type_conversion.toInt32));
};

/**
 * Convert to an unsigned 32 bit integer.
 * 
 * @param input Value to convert.
 */
var toUint32 = function(input) {
    return compute.bind(
        toNumber(input),
        compute.lift(type_conversion.toUint32));
};

/**
 * Convert to a string.
 * 
 * @param input Value to convert.
 */
var toString = function(input) {
    return compute.bind(
        toPrimitive(input, type.STRING),
        compute.lift(type_conversion.toString));
};

/**
 * Convert to an object.
 * 
 * @param input Value to convert.
 */
var toObject = function(input) {
    return compute.bind(
        value_reference.getValue(input),
        function(v) {
            switch (value.type(v))
            {
            case type.UNDEFINED:
            case type.NULL:
                return error.typeError(
                    string.concat(
                        toString(v),
                        string.create(' cannot be converted to an object')));
            
            case type.NUMBER:
                return object.construct(
                    builtin_number.Number,
                    [input]);
            
            case type.BOOLEAN:
                return object.construct(
                    builtin_boolean.Boolean,
                    [input]);
            
            case type.STRING:
                return object.construct(
                    builtin_string.String,
                    [input]);
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