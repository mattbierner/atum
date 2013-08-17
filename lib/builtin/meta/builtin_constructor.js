/**
 * @fileOverview Builtin constructor meta object.
 */
define(['exports',
        'amulet/object',
        'atum/value/object',
        'atum/builtin/meta/builtin_function'],
function(exports,
        amulet_object,
        object,
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

BuiltinConstructor.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new BuiltinConstructor(
        this.proto,
        properties,
        this._call,
        this._construct));
};

/* Export
 ******************************************************************************/
exports.BuiltinConstructor = BuiltinConstructor;

});