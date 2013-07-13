/**
 * @fileOverview Hosted function object for functions defined in the host
 * language.
 */
define(['exports',
        'atum/builtin/func',
        'atum/builtin/meta/builtin_function'],
function(exports,
        func,
        builtin_function){
"use strict";

/* BuiltinFunction
 ******************************************************************************/
/**
 * Create a new builtin function.
 * 
 * @param {string} id Identifier for function.
 * @param {number} length Number of arguments the function expects.
 * @param impl Host function providing the hosted function's implementation.
 */
var create = function(id, length, impl) {
    return new builtin_function.BuiltinFunction(
        func.functionPrototypeRef,
        {},
        id,
        impl);
};

/* Export
 ******************************************************************************/
exports.create = create;

});