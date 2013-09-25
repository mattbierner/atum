/**
 * @fileOverview Meta hosted function object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/builtin/meta/base',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_object,
        meta_base,
        error,
        func,
        object_operations,
        value_reference_operations,
        value){
//"use strict";

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
        object_operations.get(self, 'prototype'),
        function(proto) {
            return compute.bind(
                object_operations.create(
                    (proto && proto instanceof value_reference.ValueReference ?
                        proto :
                        builtin_object.ObjectPrototype)),
                function(ref) {
                    return compute.bind(
                        func.apply(self, ref, args),
                        function(result) {
                            return compute.just(result instanceof value_reference.ValueReference ?
                                result :
                                ref);
                        });
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
        return compute.bind(
            value_reference_operations.getFrom(compute.just(v.proto)),
            function(v) {
                return (v === o ?
                    compute.yes :
                    loop(v, o));
            });
    };
    
    return function(ref, v) {
        return compute.bind(
            value_reference_operations.getFrom(compute.just(v)),
            function(v) {
                if (!value.isObject(v))
                    return compute.no;
                return compute.bind(
                    value_reference_operations.getFrom(object_operations.get(ref, 'prototype')),
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