/**
 * @fileOverview
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
var create = function(id, legnth, impl) {
    return new builtin_function.BuiltinFunction(func.functionPrototypeRef, {}, id, impl);
};

/* Export
 ******************************************************************************/
exports.create = create;

});