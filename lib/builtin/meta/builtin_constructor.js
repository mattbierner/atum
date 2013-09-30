/**
 * @fileOverview Builtin constructor meta
 */
define(['exports',
        'atum/builtin/meta/builtin_function'],
function(exports,
        meta_builtin_function){
"use strict";

/* BuiltinConstructor
 ******************************************************************************/
/**
 * Meta object for a function included in the hosted language as a builtin.
 */
var BuiltinConstructor = function(proto, props, call, construct) {
    meta_builtin_function.BuiltinFunction.call(this, proto, props, null, call);
    this.construct = construct && construct.bind(this);
    this._call = call;
    this._construct = construct;
};
BuiltinConstructor.prototype = new meta_builtin_function.BuiltinFunction;
BuiltinConstructor.prototype.constructor = BuiltinConstructor;

BuiltinConstructor.prototype.setProperties = function(properties) {
    return new BuiltinConstructor(
        this.proto,
        properties,
        this._call,
        this._construct);
};

BuiltinConstructor.prototype.setPrototype = function(proto) {
    return new BuiltinConstructor(
        proto,
        this.properties,
        this._call,
        this._construct);
};

/* Export
 ******************************************************************************/
exports.BuiltinConstructor = BuiltinConstructor;

});