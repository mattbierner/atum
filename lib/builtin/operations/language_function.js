/**
 * @fileOverview Language function operations.
 */
define(['exports',
        'atum/builtin/func',
        'atum/builtin/meta/language_function'],
function(exports,
        func_builtin,
        meta_language_function){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new hosted language function.
 */
var create = function(scope, id, names, body, strict) {
    return new meta_language_function.LanguageFunction(
        func_builtin.FunctionPrototype,
        {},
        scope,
        id,
        names,
        body,
        strict);
};

/* Export
 ******************************************************************************/
exports.create = create;

});