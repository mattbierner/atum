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
        builtin_func,
        builtin_function,
        func){
//"use strict";

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
    return func.create(id, length,
        ref.setValue(new builtin_function.BuiltinFunction(
            builtin_func.FunctionPrototype,
            {},
            id,
            impl)));
};

/* Export
 ******************************************************************************/
exports.create = create;

});