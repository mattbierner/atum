/**
 * @fileOverview Hosted function object for functions defined in the host
 * language.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/builtin_function',
        'atum/operations/func',
        'atum/operations/object',
        'atum/value/property'],
function(exports,
        compute,
        func_builtin,
        object_builtin,
        meta_builtin_function,
        func,
        object,
        property){
"use strict";

/* BuiltinFunction
 ******************************************************************************/
var defineProperties = function(ref, id, length, impl) {
    return compute.next(
        func.create(id, length, ref),
        compute.bind(
            object.construct(object_builtin.Object, []),
            function(proto) {
                return object.defineProperties(compute.just(ref), {
                    'prototype': property.createValuePropertyFlags(
                        proto,
                        property.WRITABLE | property.CONFIGURABLE)
                });
            }));
};

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
         ref.setValue(new meta_builtin_function.BuiltinFunction(
            func_builtin.FunctionPrototype,
            {},
            true,
            id,
            impl)),
        defineProperties(ref, id, length, impl));
};

/* Export
 ******************************************************************************/
exports.create = create;

});