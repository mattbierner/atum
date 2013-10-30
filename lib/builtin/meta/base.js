/**
 * @fileOverview Abstract base meta
 */
var getOwnPropertyNames = Object.getOwnPropertyNames;

define(['exports',
        'amulet/record',
        'amulet/object',
        'atum/compute',
        'atum/value_reference',
        'atum/operations/boolean',
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
        record,
        amulet_object,
        compute,
        vr,
        boolean,
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
var Base = record.extend(object.Object, []);

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
            compute.bind(valueOf, function(f) { return func.functionCall(f, compute.just(ref), compute.enumeration()); }),
            function(x) {
                return (x instanceof vr.ValueReference ?
                    error.typeError() :
                    compute.just(x));
            });
        return value_reference.dereferenceFrom(toString, function(toStringImpl, toStringRef) {
            return (toStringImpl && value.isCallable(toStringImpl) ?
                compute.bind(
                    func.functionCall(toStringRef, compute.just(ref), compute.enumeration()),
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
            compute.bind(toString, function(f) { return func.functionCall(f, compute.just(ref), compute.enumeration()); }),
            function(x) {
                return (x instanceof vr.ValueReference ?
                    error.typeError() :
                    compute.just(x));
            });
        return value_reference.dereferenceFrom(valueOf, function(valueOfImpl, valueOfRef) {
            return (valueOfImpl && value.isCallable(valueOfImpl) ?
                compute.bind(
                    func.functionCall(valueOfRef, compute.just(ref), compute.enumeration()),
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
    
    return (!this.proto ? compute.no :
        value_reference.dereference(this.proto, function(proto, protoRef) {
            return proto.hasProperty(protoRef, name);
        }));
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
    var self = this;
    return (!this.proto ? compute.empty :
        value_reference.dereference(this.proto, function(proto, protoRef) {
            return proto.getProperty(protoRef, name);
        }));
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
            if (property.hasGetter(prop))
                return func.functionCall(prop.get, compute.just(ref), compute.enumeration());
            if (prop.value)
                return compute.just(prop.value);
         }
         return undef.UNDEFINED;
    });
};

/**
 * Computation that sets property `name` to `value`.
 * 
 * Calls setter on property if it exists.
 * 
 * Errors if in strict mode and setting on a non writable property.
 * 
 * @param ref Target object ref.
 * @param name Property name.
 * @param value Property value.
 * @param strict Is the set called in strict mode code.
 */
Base.prototype.set = function(ref, name, value, strict) {
    var self = this;
    return compute.bind(this.getProperty(ref, name), function(prop) {
        if (prop) {
            if (property.hasSetter(prop))
                return func.functionCall(prop.set, compute.just(ref), compute.enumeration(compute.just(value)));
            if (strict && prop.value && !prop.writable)
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
Base.prototype.canPut = function(ref, name) {
    return value_reference.dereference(ref, function(t) {
        var own = t.getOwnProperty(name);
        if (own) {
            return compute.bool(property.isAccessorDescriptor(own) ?
                own.set :
                own.writable)
        }
        
        return compute.bind(
            t.getProperty(ref, name),
            function(inherited) {
                if (!inherited)
                    return compute.bool(t.extensible);
                else if (property.isAccessorDescriptor(inherited))
                    return compute.bool(own.set);
                return compute.bool(t.extensible && inherited.writable);
            });
    });
};

/**
 * 
 */
Base.prototype.defineProperty = function(ref, name, desc, strict) {
    return value_reference.dereference(ref, function(t) {
        return compute.bind(
            t.canPut(ref, name),
            function(canPut) {
                if (!canPut) {
                    if (strict) {
                        return error.typeError(string.concat(
                            string.create(name),
                            string.create(' is not configurable')));
                    }
                    return compute.empty;
                }
                
                var current = t.getOwnProperty(name);
                if (current && !current.configurable) {
                    if (property.isAccessorDescriptor(current) ||
                      property.isDataDescriptor(current) && !property.areDataDescriptorEqual(current, desc)) {
                        return error.typeError(string.concat(
                            string.create(name),
                            string.create(' is not configurable')));
                    }
                }
                
                return ref.setValue(
                    t.setProperties(
                        amulet_object.setProperty(t.properties, name, desc, true)));
        });
    });
};

/**
 * 
 */
Base.prototype.deleteProperty = function(ref, name, strict) { 
    return value_reference.dereference(ref, function(t) {
        var desc = t.getOwnProperty(name);
        if (!desc)
            return boolean.TRUE;
        
        if (desc.configurable)
            return compute.next(
                value_reference.setValue(
                    ref,
                    t.setProperties(
                        amulet_object.deleteProperty(t.properties, name))),
                boolean.TRUE);
        
        if (strict)
            return error.typeError(string.concat(
                string.create(name),
                string.create(' is not configurable')));
        
        return boolean.FALSE;
    });
};

/* Export
 ******************************************************************************/
exports.Base = Base;

});