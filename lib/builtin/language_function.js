/**
 * @fileOverview Hosted function object for functions defined in the hosted
 * language.
 */
define(['exports',
        'atum/builtin/func',
        'atum/builtin/meta/language_function'],
function(exports,
        func,
        meta_language_function){
"use strict";

/* LanguageFunction
 ******************************************************************************/
/**
 * Create a new hosted language function.
 */
var create = function(scope, id, names, body, strict) {
    return new meta_language_function.LanguageFunction(
        func.FunctionPrototype,
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