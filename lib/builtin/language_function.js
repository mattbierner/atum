/**
 * 
 */
define(['exports',
        'atum/builtin/func',
        'atum/builtin/meta/language_function',],
function(exports,
        func,
        meta_language_function){
//"use strict";

/* LanguageFunction
 ******************************************************************************/
var create = function(scope, id, names, body, strict) {
    return new meta_language_function.LanguageFunction(func.functionPrototypeRef, {}, scope, id, names, body, strict);
};

/* Export
 ******************************************************************************/
exports.create = create;

});