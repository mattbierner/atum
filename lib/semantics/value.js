/**
 * @fileOverview Semantics for values in the hosted language.
 */
define(['atum/compute',
        'atum/builtin/operations/array',
        'atum/builtin/object',
        'atum/builtin/regexp',
        'atum/operations/boolean',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/internal_reference',
        'atum/operations/nil',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/value/number',
        'atum/value/string'],
function(compute,
        array,
        object_builtin,
        regexp_builtin,
        boolean,
        environment,
        error,
        internal_reference,
        nil,
        number,
        object,
        string,
        number_value,
        string_value){
"use strict";

var map = Function.prototype.call.bind(Array.prototype.map);

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Primitive Values
 ******************************************************************************/
var numberLiteral = number.create;

var booleanLiteral = boolean.create;

var stringLiteral = string.create;

var nullLiteral = function() { return nil.NULL; }

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
    return object.construct(
        regexp_builtin.RegExp,
        [new string_value.String(pattern.body), new string_value.String(pattern.flags)]);
};

/**
 * Object literal
 * 
 * @param properties Object mapping string key values to property descriptors.
 */
var objectLiteral = function(properties) {
    return object.defineProperties(
        object.construct(object_builtin.Object, []),
        reduce(Object.keys(properties), function(p, key) {
            var prop = properties[key];
            if (prop.get || prop.set) {
                if (prop.value || prop.writable)
                    return error.typeError();
            }
            
            var desc = {};
            if ('enumerable' in prop)
                desc['enumerable'] = prop['enumerable'];
            
            if ('writable' in prop)
                desc['writable'] = prop['writable'];
            
            if ('configurable' in prop)
                desc['configurable'] = prop['configurable'];
            
            if (prop.value)
                desc['value'] = internal_reference.getFrom(prop.value);
            
            if (prop.get)
                desc['get'] = internal_reference.getFrom(prop.get);
            
            if (prop.set)
                desc['set'] = internal_reference.getFrom(prop.set);
                        
            p[key] = desc;
            return p;
        }, {}));
};

/**
 * Array literal semantics.
 */
var arrayLiteral = function(elements) {
    return array.create(map(elements, function(x) {
        return (x ? internal_reference.getFrom(x) : null);
    }));
};

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