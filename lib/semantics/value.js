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
 * @param pattern Object with properties for the body and flags of the regular expression.
 */
var regularExpressionLiteral = function(pattern) {
    return regexp_builtin.createFromHost(
        pattern.body,
        pattern.flags);
};

/**
 * Object literal
 * 
 * Errors if attempting to redefine a property already set by the object literal.
 * 
 * @param properties Array of properties.
 */
var objectLiteral = function(properties) {
    return compute.bind(object_builtin.create(), function(t) {
        var props = compute.map_(function(prop) {
            var key = prop.key;
            return compute.bind(object.getOwnProperty(t, key), function(previous) {
                if (previous) {
                    switch (prop.type) {
                    case 'value':
                        if (property.isDataDescriptor(previous))
                            return error.syntaxError("Cannot redefine value for:" + key);
                        if (property.isAccessorDescriptor(previous))
                            return error.syntaxError("Cannot set value for accessor:" + key);
                        break;
                    case 'get':
                        if (property.isDataDescriptor(previous))
                            return error.syntaxError("Cannot define accessor for value:" + key);
                        if (property.hasGetter(previous))
                            return error.syntaxError("Cannot redefine getter for:" + key);
                        break;
                    case 'set':
                        if (property.isDataDescriptor(previous))
                            return error.syntaxError("Cannot define accessor for value:" + key);
                        if (property.hasSetter(previous))
                            return error.syntaxError("Cannot redefine setter for:" + key);
                        break;
                    }
                }
                
                switch (prop.type) {
                case 'get':
                    return internal_reference.dereferenceFrom(prop.value, function(get) {
                        return object.defineProperty(t, key, property.createAccessorPropertyFlags(
                            get,
                            undefined,
                            property.ENUMERABLE | property.CONFIGURABLE));
                    });
                case 'set':
                    return internal_reference.dereferenceFrom(prop.value, function(set) {
                        return object.defineProperty(t, key, property.createAccessorPropertyFlags(
                            undefined,
                            set,
                            property.ENUMERABLE | property.CONFIGURABLE));
                    });
                default:
                    return internal_reference.dereferenceFrom(prop.value, function(value) {
                        return object.defineProperty(t, key, property.createValuePropertyFlags(
                            value,
                            property.ALL));
                    });
                }
            });
        }, properties);
        
        return compute.next(
            props,
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