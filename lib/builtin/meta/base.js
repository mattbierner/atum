/**
 * @fileOverview Abstract base meta
 */
var getOwnPropertyNames = Object.getOwnPropertyNames;

define(['exports',
        'bes/record',
        'atum/compute',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/property',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        record,
        compute,
        error,
        func,
        object_operations,
        undef,
        value_reference,
        object,
        property,
        type,
        value){
"use strict";

/* Base
 ******************************************************************************/
var Base = record.extend(object.Object,
    []);

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
        var vof = error.assert(
            value.isPrimitive,
            error.typeError(),
            value_reference.getFrom(
                compute.bind(valueOf, function(f) { return func.functionApply(f, ref, []); })));

        return value_reference.dereferenceFrom(toString, function(toStringImpl, toStringRef) {
            return (toStringImpl && value.isCallable(toStringImpl) ?
                error.assert(
                    value.isPrimitive,
                    vof,
                    value_reference.getFrom(
                        func.functionApply(toStringRef, ref, []))) :
                vof);
        });
    
    case type.NUMBER:
    default:
        var vof = error.assert(
            value.isPrimitive,
            error.typeError(),
            value_reference.getFrom(
                compute.bind(toString, function(f) { return func.functionApply(f, ref, []); })));
        
        return value_reference.dereferenceFrom(valueOf, function(valueOfImpl, valueOfRef) {
            return (valueOfImpl && value.isCallable(valueOfImpl) ?
                error.assert(
                    value.isPrimitive,
                    vof,
                    value_reference.getFrom(
                        func.functionApply(valueOfRef, ref, []))) :
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
 * Computation that gets the property descriptor for property 'name'.
 * 
 * Checks prototype chain if not found on this object. Returns a computation that
 * yields null if no property for 'name' can be found.
 * 
 * @param ref Value reference to the object called on.
 * @param {String} name Property name.
 */
Base.prototype.getProperty = function(ref, name) {
    if (this.hasOwnProperty(name))
        return compute.just(this.getOwnProperty(name));
    
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
                return func.functionApply(prop.get, ref, []);
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
                return func.functionApply(prop.set, ref, [value]);
            
            if (strict && prop.value && !prop.writable)
                return error.typeError(name + ' is not wriable');
            
            return self.defineProperty(ref, name, prop.setValue(value));
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
 * Can property `name` be set on this object.
 * 
 * @param ref Target object ref.
 * @param name Property name.
 */
Base.prototype.canPut = function(ref, name) {
    return value_reference.dereference(ref, function(t) {
        var own = t.getOwnProperty(name);
        if (own) {
            return compute.bool(property.isAccessorDescriptor(own) ?
                property.hasSetter(own) :
                own.writable);
        }
        
        return compute.bind(
            t.getProperty(ref, name),
            function(inherited) {
                if (!inherited)
                    return compute.bool(t.extensible);
                if (property.isAccessorDescriptor(inherited))
                    return compute.bool(property.hasSetter(own));
                return compute.bool(t.extensible && inherited.writable);
            });
    });
};

/**
 * Define property `name` on this object.
 * 
 * @param ref Target object ref.
 * @param name Property name.
 * @param desc Property descriptor.
 * @param strict Should error throw, as in strict mode.
 */
Base.prototype.defineProperty = function(ref, name, desc, strict) {
    return value_reference.dereference(ref, function(t) {
        return compute.bind(
            t.canPut(ref, name),
            function(canPut) {
                if (!canPut) {
                    return (strict ?
                        error.typeError(name + ' is not configurable') :
                        compute.empty);
                }
                
                var current = t.getOwnProperty(name);
                if (current && !current.configurable) {
                    if (property.isAccessorDescriptor(current) ||
                      property.isDataDescriptor(current) && !property.areDataDescriptorEqual(current, desc)) {
                        return error.typeError(name +' is not configurable');
                    }
                }
                
                return ref.setValue(
                    t.setProperty(name, desc));
        });
    });
};

/**
 * Delete property `name` on this object.
 * 
 * @param ref Target object ref.
 * @param name Property name.
 * @param strict Should error throw, as in strict mode.
 * 
 * @returns Was the deletion operation successful.
 */
Base.prototype.deleteProperty = function(ref, name, strict) { 
    return value_reference.dereference(ref, function(t) {
        var desc = t.getOwnProperty(name);
        if (!desc)
            return compute.yes;
        
        if (desc.configurable)
            return compute.next(
                ref.setValue(
                    t.removeProperty(name)),
                compute.yes);
        
        if (strict)
            return error.typeError(name + ' is not configurable');
        
        return compute.no;
    });
};

/* Export
 ******************************************************************************/
exports.Base = Base;

});