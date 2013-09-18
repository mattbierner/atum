/**
 * @fileOverview Hosted object meta.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/object', 
        'atum/value/value'],
function(exports,
        compute,
        vr,
        error,
        func,
        object_operations,
        value_reference,
        object,
        value){
"use strict";

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function(proto, properties) {
    object.Object.call(this, proto, properties);
};
Object.prototype = new object.Object;
Object.prototype.constructor = Object;

Object.prototype.cls = "Object";

Object.prototype.setProperties = function(properties) {
    return new Object(this.proto, properties);
};

/**
 * Base implementation of a computation that returns the default value of
 * an object.
 * 
 * The returned value must be a primitive.
 * 
 * Attempts to call either 'toString' or 'valueOf' on the object or errors if
 * neither exists or both return non primitve values.
 */
Object.prototype.defaultValue = function(ref, hint) {
    var toString = object_operations.get(ref, "toString"),
        valueOf = object_operations.get(ref, "valueOf");

    switch (hint)
    {
    case 'String':
        var vof = compute.bind(
            func.call(valueOf, compute.just(ref), compute.enumeration()),
            function(x) {
                return (x instanceof vr.ValueReference ?
                    error.typeError() :
                    compute.just(x));
            });
        return compute.bind(value_reference.getFrom(toString), function(toStringImpl) {
            return (toStringImpl && value.isCallable(toStringImpl) ?
                compute.bind(
                    func.call(toString, compute.just(ref), compute.enumeration()),
                    function(x) {
                        return (x instanceof vr.ValueReference ?
                            vof :
                            compute.just(x))
                    }) :
                vof);
        });
    case 'Number':
    default:
        var vof = compute.bind(
            func.call(toString, compute.just(ref), compute.enumeration()),
            function(x) {
                return (x instanceof vr.ValueReference ?
                    error.typeError() :
                    compute.just(x));
            });
        return compute.bind(value_reference.getFrom(valueOf), function(valueOfImpl) {
            return (valueOfImpl && value.isCallable(valueOfImpl) ?
                compute.bind(
                    func.call(valueOf, compute.just(ref), compute.enumeration()),
                    function(x) {
                        return (x instanceof vr.ValueReference ?
                            vof :
                            compute.just(x))
                    }) :
                vof);
        });
    }
};

/* Export
 ******************************************************************************/
exports.Object = Object;

});