/**
 * @fileOverview
 */
define(['atum/value/object',
        'atum/builtin/func',
        'exports'],
function(object,
        func){
"use strict";

/* BuiltinFunction
 ******************************************************************************/
/**
 * Meta object for a function included in the hosted language as a builtin.
 */
var BuiltinFunction = function(id, impl) {
    func.Function.call(this);
    this.id = id;
    this.impl = impl;
};
BuiltinFunction.prototype = new func.Function;

BuiltinFunction.prototype.call = function(/*...*/) {
    return this.impl.apply(this, arguments);
};

/* Export
 ******************************************************************************/
return {
    'BuiltinFunction': BuiltinFunction
};

});