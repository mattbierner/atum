/**
 * @fileOverview Semantics for values in the hosted language.
 */
define(['atum/compute',
        'atum/fun',
        'atum/builtin/operations/array',
        'atum/builtin/operations/object',
        'atum/builtin/operations/regexp',
        'atum/operations/boolean',
        'atum/operations/construct',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/internal_reference',
        'atum/operations/nil',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/value/property'],
function(compute,
        fun,
        array_builtin,
        object_builtin,
        regexp_builtin,
        boolean,
        construct,
        environment,
        error,
        internal_reference,
        nil,
        number,
        object,
        string,
        property){
"use strict";

/* Primitive Values
 ******************************************************************************/
var numberLiteral = number.create;

var booleanLiteral = boolean.create;

var stringLiteral = string.create;

var nullLiteral = fun.constant(nil.NULL);

/* Object Type Values
 ******************************************************************************/
/**
 * Regular Expression Literal
 * 
 * Errors if the resulting regular expression is invalid.
 * 
 * @param pattern Object with properties  for the body and flags of the regular expression.
 */
var regularExpressionLiteral = function(pattern) {
    return regexp_builtin.createFromHost(
        pattern.body,
        pattern.flags);
};

/**
 * Object literal
 * 
 * @param properties Object mapping string key values to property descriptors.
 */
var objectLiteral = function(properties) {
    return compute.bind(object_builtin.create(), function(t) {
        var props = fun.map(function(key) {
            var prop = properties[key];
            if (prop.get || prop.set) {
                if (prop.value || prop.writable)
                    return error.typeError();
            }
            if (property.isAccessorDescriptor(prop)) {
                return compute.binary(
                    prop.get ? internal_reference.getFrom(prop.get) : compute.empty,
                    prop.set ? internal_reference.getFrom(prop.set) : compute.empty,
                    function(get, set) {
                        return object.defineProperty(t, key, property.createAccessorProperty(
                            get,
                            set,
                            prop.enumerable,
                            prop.configurable));
                    });
            }
            return compute.bind(
                internal_reference.getFrom(prop.value),
                function(value) {
                    return object.defineProperty(t, key, property.createValueProperty(
                        value,
                        prop.enumerable,
                        prop.writable,
                        prop.configurable));
                });
        }, Object.keys(properties));
        
        return compute.next(
            compute.sequencea(props),
            compute.just(t));
    });
};

/**
 * Array literal semantics.
 */
var arrayLiteral = fun.compose(
    array_builtin.create,
    fun.curry(fun.map, function(x) {
        return (x ? internal_reference.getFrom(x) : null);
    }));

/* Symbols
 ******************************************************************************/
var identifier = environment.getBinding;

/* Export
 ******************************************************************************/
return {
// Primitive Values
    'numberLiteral': numberLiteral,
    'booleanLiteral': booleanLiteral,
    'stringLiteral': stringLiteral,
    'nullLiteral': nullLiteral,

// Object Type Values
    'regularExpressionLiteral': regularExpressionLiteral,
    'objectLiteral': objectLiteral,
    'arrayLiteral': arrayLiteral,

// Symbols
    'identifier': identifier
};

});