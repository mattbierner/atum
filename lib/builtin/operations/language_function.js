/**
 * @fileOverview Language function operations.
 */
define(['exports',
        'atum/builtin/func',
        'atum/builtin/meta/language_function',
        'atum/operations/value_reference'],
function(exports,
        func_builtin,
        meta_language_function,
        value_reference){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new hosted language function.
 */
var create = function(scope, id, names, body, strict) {
    return value_reference.create(
        new meta_language_function.LanguageFunction(
            func_builtin.FunctionPrototype,
            {},
            true,
            scope,
            id,
            names,
            body,
            strict));
};

/* Export
 ******************************************************************************/
exports.create = create;

});