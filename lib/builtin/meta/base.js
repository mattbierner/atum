/**
 * @fileOverview Abstract base meta
 */
var getOwnPropertyNames = Object.getOwnPropertyNames;

define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/value_reference',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/property',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        amulet_object,
        compute,
        vr,
        error,
        func,
        object_operations,
        string,
        undef,
        value_reference,
        object,
        property,
        type,
        value){
"use strict";

/* Base
 ******************************************************************************/
var Base = function(proto, properties) {
    object.Object.call(this, proto, properties);
};
Base.prototype = new object.Object;
Base.prototype.constructor = Base;

Base.prototype.preferedType = type.NUMBER;

/**
 * Base implementation of a computation that returns the default value of
 * an object.
 * 
 * The returned value must be a primitive.
 * 
 * Attempts to call either 'toString' or 'valueOf' on the object or errors if
 * neither exists or both return non primitve values.
 */
Base.prototype.defaultValue = function(ref, hint) {
    var toString = object_operations.get(ref, "toString"),
        valueOf = object_operations.get(ref, "valueOf");

    switch (hint || this.preferedType)
    {
    case type.STRING:
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
    case type.NUMBER:
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

/**
 * Method that returns a computation that checks if a given object is an instance
 * of this object.
 */
Base.prototype.hasInstance = null;

/**
 * Get a computation that returns whether this object has a property `name`.
 * 
 * Checks prototype chain if not found on this object.
 * 
 * @param ref Value reference to the object called on.
 * @param {String} name Property name.
 */
Base.prototype.hasProperty = function(ref, name) {
    if (this.hasOwnProperty(name))
        return compute.yes;
    
    var protoRef = this.proto;
    return (protoRef ?
        compute.bind(protoRef.getValue(), function(proto) {
            return proto.hasProperty(protoRef, name);
        }) :
        compute.no);
};

/**
 * Ccomputation that gets the property descriptor for property 'name'.
 * 
 * Checks prototype chain if not found on this object. Returns a computation that
 * yields null if no property for 'name' can be found.
 * 
 * @param ref Value reference to the object called on.
 * @param {String} name Property name.
 */
Base.prototype.getProperty = function(ref, name) {
    var prop = this.getOwnProperty(name);
    if (prop)
        return compute.just(prop);
    
    var protoRef = this.proto;
    return (protoRef ?
        compute.bind(protoRef.getValue(), function(proto) {
            return proto.getProperty(protoRef, name);
        }) :
        compute.empty);
};

/**
 * Computation that returns the value of property 'name'.
 * 
 * @param ref Value reference to the object called on.
 * @param {String} name Property name.
 */
Base.prototype.get = function(ref, name) {
    return compute.bind(this.getProperty(ref, name), function(prop) {
        if (prop) {
            if (prop.get)
                return func.call(compute.just(prop.get), compute.just(ref), compute.enumeration());
            else if (prop.value)
                return compute.just(prop.value);
         }
         return undef.UNDEFINED;
    });
};

/**
 * Computation that sets property `name` to `value`.
 * 
 * Calls setter on property if it exists.
 */
Base.prototype.set = function(ref, name, value) {
    var self = this;
    return compute.bind(this.getProperty(ref, name), function(prop) {
        if (prop) {
            if (prop.set)
                return func.call(compute.just(prop.set), compute.just(ref), compute.enumeration(compute.just(value)));
            else if (prop.value && !prop.writable)
                return error.typeError(string.create(name + ' is not wriable'));
        }
        
        return self.defineProperty(
            ref,
            name,
            property.createValuePropertyFlags(
                value,
                property.WRITABLE | property.ENUMERABLE | property.CONFIGURABLE));
    });
};

/**
 * 
 */
Base.prototype.defineProperty = function(ref, name, desc) {
    return value_reference.dereference(ref, function(t) {
        /*var current = t.getOwnProperty(name);
        if (current && !current.configurable)
            return error.typeError(string.concat(
                string.create(name),
                string.create(' is not configurable'))); */
        
        return ref.setValue(t.setProperties(
            amulet_object.defineProperty(t.properties, name, {
                'value': desc,
                'enumerable': true,
                'configurable': true
            })));
    });
};

/**
 * 
 */
Base.prototype.deleteProperty = function(ref, propertyName) { 
    return value_reference.modifyValue(ref, function(t) {
        return t.setProperties(
            amulet_object.deleteProperty(t.properties, propertyName));
    });
};

/* Export
 ******************************************************************************/
exports.Base = Base;

});