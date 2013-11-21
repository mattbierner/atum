/**
 * @fileOverview Language function operations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/meta/language_function',
        'atum/builtin/operations/object',
        'atum/operations/construct',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/string',
        'atum/value/property'],
function(exports,
        compute,
        func_builtin,
        meta_language_function,
        object_builtin,
        construct,
        func,
        object,
        value_reference,
        number_value,
        string_value,
        property){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new hosted language function.
 */
var create = function(scope, strict, id, names, code, declarations, body) {
    return compute.binary(
        value_reference.create(
            meta_language_function.LanguageFunction.create(
                func_builtin.FunctionPrototype,
                {},
                true,
                scope,
                strict,
                id,
                names,
                code,
                declarations,
                body)),
        object_builtin.create(),
        function(impl, proto) {
            return object.defineProperties(impl, {
                'prototype': property.createValuePropertyFlags(
                    proto,
                    property.WRITABLE | property.CONFIGURABLE),

                'length': property.createValuePropertyFlags(
                     new number_value.Number(length)),

                'name': property.createValuePropertyFlags(
                     (id ? new string_value.String(id) : string_value.EMPTY))
            });
        });
};

/* Export
 ******************************************************************************/
exports.create = create;

});