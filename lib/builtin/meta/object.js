/**
 * @fileOverview Hosted object meta.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/operations/func',
        'atum/operations/value_reference',
        'atum/value/object', 
        'atum/value/value'],
function(exports,
        amulet_object,
        compute,
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
 * Attempts to call either 'toString' or 'valueOf' on the object or errors if
 * neither exists.
 * 
 * @todo Handle error case.
 */
Object.prototype.defaultValue = function(ref, hint) {
    var toString = this.get(ref, "toString"),
        valueOf = this.get(ref, "valueOf");

    var impl; switch (hint)
    {
    case 'String':
        impl = compute.bind(value_reference.getValue(toString), function(toStringImpl) {
            return (toStringImpl && value.isCallable(toStringImpl) ?
                compute.just(toStringImpl) :
                valueOf);
        });
    case 'Number':
    default:
         impl = compute.bind(value_reference.getValue(valueOf), function(valueOfImpl) {
            return (valueOfImpl && value.isCallable(valueOfImpl) ?
                compute.just(valueOfImpl) :
                toString);
        });
    }
    
    return func.call(
        impl,
        compute.just(ref),
        compute.enumeration());
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