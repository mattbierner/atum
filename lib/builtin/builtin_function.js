/**
 * @fileOverview
 */
define(['exports',
        'atum/value/object',
        'atum/builtin/func'],
function(exports,
        object,
        func){
"use strict";

/* BuiltinFunction
 ******************************************************************************/
/**
 * Meta object for a function included in the hosted language as a builtin.
 */
var BuiltinFunction = function(id, impl) {
    func.FunctionPrototype.call(this);
    this.id = id;
    this.impl = impl;
};
BuiltinFunction.prototype = new func.FunctionPrototype;

BuiltinFunction.prototype.call = function(/*...*/) {
    return this.impl.apply(this, arguments);
};

/* Export
 ******************************************************************************/
exports.BuiltinFunction = BuiltinFunction;


});