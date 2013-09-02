/**
 * @fileOverview Hosted object meta.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/value_reference',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/value_reference',
        'atum/value/object', 
        'atum/value/value'],
function(exports,
        amulet_object,
        compute,
        vr,
        error,
        func,
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
    var toString = this.get(ref, "toString"),
        valueOf = this.get(ref, "valueOf");

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
        return compute.bind(value_reference.getValue(toString), function(toStringImpl) {
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
        return compute.bind(value_reference.getValue(valueOf), function(valueOfImpl) {
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

Object.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new Object(
        this.proto,
        properties));
};

/* Export
 ******************************************************************************/
exports.Object = Object;

});