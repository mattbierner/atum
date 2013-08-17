/**
 * @fileOverview Builtin function meta object.
 */
define(['exports',
        'amulet/object',
        'atum/value/object',
        'atum/builtin/meta/func'],
function(exports,
        amulet_object,
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

BuiltinFunction.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new BuiltinFunction(
        this.proto,
        properties,
        this.id,
        this.impl));
};

/* Export
 ******************************************************************************/
exports.BuiltinFunction = BuiltinFunction;

});