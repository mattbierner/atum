/**
 * @fileOverview Builtin constructor meta
 */
define(['exports',
        'amulet/record',
        'atum/builtin/meta/builtin_function'],
function(exports,
        record,
        meta_builtin_function){
"use strict";

/* BuiltinConstructor
 ******************************************************************************/
/**
 * Meta object for a function included in the hosted language as a builtin.
 */
var BuiltinConstructor = record.declare(new meta_builtin_function.BuiltinFunction, [
    'proto',
    'properties',
    'extensible',
    '_call',
    '_construct'],
    function(proto, props, extensible, call, construct) {
        meta_builtin_function.BuiltinFunction.call(this, proto, props, extensible, null, call);
        this.construct = construct && construct.bind(this);
        this._call = call;
        this._construct = construct;
    });

/* Export
 ******************************************************************************/
exports.BuiltinConstructor = BuiltinConstructor;

});