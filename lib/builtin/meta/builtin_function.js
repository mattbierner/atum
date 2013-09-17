/**
 * @fileOverview Builtin function meta object.
 */
define(['exports',
        'atum/value/object',
        'atum/builtin/meta/func'],
function(exports,
        object,
        meta_func){
"use strict";

/* BuiltinFunction
 ******************************************************************************/
/**
 * Meta object for a function included in the hosted language as a builtin.
 */
var BuiltinFunction = function(proto, props, id, impl) {
    meta_func.Function.call(this, proto, props);
    this.id = id;
    this.impl = impl;
    this.call = (impl ? impl.bind(this) : null);
};
BuiltinFunction.prototype = new meta_func.Function;
BuiltinFunction.prototype.constructor = BuiltinFunction;

BuiltinFunction.prototype.setProperties = function(properties) {
    return new BuiltinFunction(
        this.proto,
        properties,
        this.id,
        this.impl);
};

/* Export
 ******************************************************************************/
exports.BuiltinFunction = BuiltinFunction;

});