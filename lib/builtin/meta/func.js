/**
 * @fileOverview Meta hosted function object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_object,
        error,
        func,
        object_operations,
        value_reference_semantics,
        object,
        value){
//"use strict";

/* Function
 ******************************************************************************/
/**
 * Hosted function meta object.
 */
var Function = function(proto, props) {
    object.Object.call(this, proto, props);
};
Function.prototype = new object.Object;
Function.prototype.constructor = Function;

Function.prototype.cls = "Function";

/**
 * Construct computation.
 * 
 * 
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
                        func.call(
                            compute.just(self),
                            compute.just(ref),
                            compute.enumerationa(args.args.map(compute.just))),
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
            value_reference_semantics.getValue(compute.just(v.proto)),
            function(v) {
                return (v === o ?
                    compute.yes :
                    loop(v, o));
            });
    };
    
    return function(ref, v) {
        return compute.bind(
            value_reference_semantics.getValue(compute.just(v)),
            function(v) {
                if (!value.isObject(v))
                    return compute.no;
                return compute.bind(
                    value_reference_semantics.getValue(object_operations.get(ref, 'prototype')),
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