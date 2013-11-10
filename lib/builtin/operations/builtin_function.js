/**
 * @fileOverview Hosted function object for functions defined in the host
 * language.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/meta/builtin_function',
        'atum/operations/object',
        'atum/value/number',
        'atum/value/string',
        'atum/value/property'],
function(exports,
        compute,
        func_builtin,
        meta_builtin_function,
        object,
        number_value,
        string_value,
        property){
"use strict";

/* BuiltinFunction
 ******************************************************************************/
/**
 * Create a new builtin function.
 * 
 * @param {ref} Value reference the builtin function is being created on.
 * @param {string} id Identifier for function.
 * @param {number} length Number of arguments the function expects.
 * @param impl Host function providing the hosted function's implementation.
 */
var create = function(ref, id, length, impl) {
    return compute.next(
         ref.setValue(meta_builtin_function.BuiltinFunction.create(
            func_builtin.FunctionPrototype,
            {},
            true,
            impl)),
        object.defineProperties(compute.just(ref), {
            'length': property.createValuePropertyFlags(
                new number_value.Number(length)),
            
            'name': property.createValuePropertyFlags(
                (id ? new string_value.String(id) : string_value.EMPTY))
        }));
};

/* Export
 ******************************************************************************/
exports.create = create;

});