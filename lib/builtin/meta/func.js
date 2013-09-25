/**
 * @fileOverview Meta hosted function object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/object',
        'atum/builtin/meta/base',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/value'],
function(exports,
        compute,
        builtin_object,
        meta_base,
        error,
        func,
        object_operations,
        value_reference,
        value){
"use strict";

/* Function
 ******************************************************************************/
/**
 * Hosted function meta object.
 */
var Function = function(proto, props) {
    meta_base.Base.call(this, proto, props);
};
Function.prototype = new meta_base.Base;
Function.prototype.constructor = Function;

Function.prototype.cls = "Function";

/**
 * Construct computation.
 */
Function.prototype.construct = function(self, args) {
    return compute.bind(
        value_reference.dereferenceFrom(
            object_operations.get(self, 'prototype'),
            function(proto, protoRef) {
                return object_operations.create(value.isObject(proto) ?
                    protoRef :
                    builtin_object.ObjectPrototype);
            }),
        function(t) {
            return value_reference.dereferenceFrom(
                func.apply(self, t, args),
                function(result, resultRef) {
                    return compute.just(value.isObject(result) ? resultRef : t);
                });
        });
};

/**
 * Is computation `v` an instance of function `ref`.
 */
Function.prototype.hasInstance = (function(){
    var loop = function(v, o) {
        if (!v.proto)
            return compute.no;
        return value_reference.dereference(v.proto, function(v) {
            return (v === o ? compute.yes : loop(v, o));
        });
    };
    
    return function(ref, v) {
        return value_reference.dereference(v, function(v) {
            if (!value.isObject(v))
                return compute.no;
            return value_reference.dereferenceFrom(
                object_operations.get(ref, 'prototype'),
                function(o) {
                    if (!value.isObject(o))
                        return error.typeError();
                    return loop(v, o);
                });
        });
    };
}());

/* Export
 ******************************************************************************/
exports.Function = Function;

});