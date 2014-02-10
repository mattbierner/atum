/**
 * @fileOverview Function meta
 */
define(['exports',
        'bes/record',
        'atum/compute',
        'atum/builtin/object',
        'atum/builtin/meta/base',
        'atum/operations/construct',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/value'],
function(exports,
        record,
        compute,
        object_builtin,
        meta_base,
        construct,
        error,
        func,
        object,
        value_reference,
        value){
"use strict";

/* Function
 ******************************************************************************/
/**
 * Function abstract base meta
 */
var Function = record.extend(meta_base.Base, []);

Function.prototype.cls = "Function";

Function.prototype.construct = function(self, args) {
    return compute.bind(
        value_reference.dereferenceFrom(
            object.get(self, 'prototype'),
            function(proto, protoRef) {
                return construct.create(
                    (value.isObject(proto) ?
                        protoRef :
                        object_builtin.ObjectPrototype),
                    {},
                    true);
            }),
        function(t) {
            return value_reference.dereferenceFrom(
                func.forward(self, t, args),
                function(result, resultRef) {
                    return compute.just(value.isObject(result) ? resultRef : t);
                });
        });
};

/**
 * Is `v` an instance of function `ref`.
 * 
 * @param ref Reference to this object.
 * @param v Other object.
 */
Function.prototype.hasInstance = (function(){
    var checkProtoChain = function(v, o) {
        if (!v.proto)
            return compute.no;
        return value_reference.dereference(v.proto, function(v) {
            return (v === o ? compute.yes : checkProtoChain(v, o));
        });
    };
    
    return function(ref, v) {
        return value_reference.dereference(v, function(v) {
            if (!value.isObject(v))
                return compute.no;
            return value_reference.dereferenceFrom(
                object.get(ref, 'prototype'),
                function(o) {
                    if (!value.isObject(o))
                        return error.typeError();
                    return checkProtoChain(v, o);
                });
        });
    };
}());

/* Export
 ******************************************************************************/
exports.Function = Function;

});