/**
 * @fileOverview Hosted function object for functions defined in the host
 * language.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/meta/builtin_function',
        'atum/operations/func'],
function(exports,
        compute,
        func_builtin,
        meta_builtin_function,
        func){
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
        func.create(id, length,
            ref.setValue(new meta_builtin_function.BuiltinFunction(
                func_builtin.FunctionPrototype,
                {},
                id,
                impl))),
        compute.just(ref));
};

/* Export
 ******************************************************************************/
exports.create = create;

});