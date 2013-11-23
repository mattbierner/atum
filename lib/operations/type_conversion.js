/**
 * @fileOverview Type conversion operations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/operations/boolean',
        'atum/builtin/operations/number',
        'atum/builtin/operations/string',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/type_conversion',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        boolean_builtin,
        number_builtin,
        string_builtin,
        boolean,
        error,
        string,
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
 * @param [preferredType] Hint for type to convert to.
 * @param input Value to convert.
 */
var toPrimitive = function(preferredType, input) {
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
var toNumber = compute.compose(
    fun.curry(toPrimitive, type.NUMBER),
    compute.lift(type_conversion.toNumber));

/**
 * Convert to an integer.
 * 
 * @param input Value to convert.
 */
var toInteger = compute.compose(
    toNumber,
    compute.lift(type_conversion.toInteger));

/**
 * Convert to a signed 32 bit integer.
 * 
 * @param input Value to convert.
 */
var toInt32 = compute.compose(
    toNumber,
    compute.lift(type_conversion.toInt32));

/**
 * Convert to an unsigned 32 bit integer.
 * 
 * @param input Value to convert.
 */
var toUint32 = compute.compose(
    toNumber,
    compute.lift(type_conversion.toUint32));

/**
 * Convert to a string.
 * 
 * @param input Value to convert.
 */
var toString =  compute.compose(
    fun.curry(toPrimitive, type.STRING),
    compute.lift(type_conversion.toString));

/**
 * Convert to an object.
 * 
 * @param input Value to convert.
 */
var toObject = function(input) {
    return value_reference.dereference(input, function(v, ref) {
        switch (value.type(v))
        {
        case type.UNDEFINED:
        case type.NULL:
            return error.typeError(
                string.concat(
                    toString(v),
                    string.create(' cannot be converted to an object')));
        
        case type.NUMBER:
            return number_builtin.create(ref);
        
        case type.BOOLEAN:
            return boolean_builtin.create(ref);
        
        case type.STRING:
            return string_builtin.create(ref);
        }
        return compute.just(ref);
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