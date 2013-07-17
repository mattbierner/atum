/**
 * @fileOverview Value Semantics.
 */
define(['atum/compute',
        'atum/builtin/array',
        'atum/builtin/object',
        'atum/operations/boolean',
        'atum/operations/environment',
        'atum/operations/internal_reference',
        'atum/operations/nil',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/semantics/expression'],
function(compute,
        builtin_array,
        object_builtin,
        boolean,
        environment,
        internal_reference,
        nil,
        number,
        object,
        string,
        expression){
"use strict";

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Literals
 ******************************************************************************/
var numberLiteral = number.create;

var booleanLiteral = boolean.create;

var stringLiteral = string.create;

var nullLiteral = nil.create;

var regularExpressionLiteral /* @TODO */;

/* Complex Type Literals
 ******************************************************************************/
/**
 * Semantics for creating an object literal.
 * 
 * @param properties Object mapping string key values to property descriptors.
 */
var objectLiteral = function(properties) {
    return object.defineProperties(
        expression.newExpression(compute.just(object_builtin.Object), []),
        reduce(Object.keys(properties), function(p, key) {
            var prop = properties[key];
            p[key] = {
                'value': prop.value ? internal_reference.getValue(prop.value) : null,
                'get': prop.get ? internal_reference.getValue(prop.get) : null,
                'set': prop.set ? internal_reference.getValue(prop.set) : null
            };
            return p;
        }, {}));
};

/**
 */
var arrayLiteral = function(elements) {
    return reduce(elements, function(p, c, i) {
        return object.defineProperty(
            p,
            i + "", {
                'value': internal_reference.getValue(c),
                'writable': true,
                'enumerable': true,
                'configurable': true
            });
    }, expression.newExpression(compute.just(builtin_array.Array), [number.create(elements.length)]));

};

/* Symbols
 ******************************************************************************/
var identifier = environment.getBinding;

/* Export
 ******************************************************************************/
return {
    'numberLiteral': numberLiteral,
    'booleanLiteral': booleanLiteral,
    'stringLiteral': stringLiteral,
    'nullLiteral': nullLiteral,
    'regularExpressionLiteral': regularExpressionLiteral,
    
    'objectLiteral': objectLiteral,
    'arrayLiteral': arrayLiteral,
    
    'identifier': identifier
};

});