/**
 * @fileOverview
 */
define(['amulet/object',
        'atum/compute',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/operations/undef',
        'atum/value/value',
        'atum/value/type'],
function(amulet_object,
        compute,
        error,
        func,
        string,
        value_reference,
        undef,
        value,
        type) {
//"use strict";

/* AtumObject
 ******************************************************************************/
/**
 * 
 */
var AtumObject = function(proto, properties) {
    value.Value.call(this);
    this.proto = proto;
    this.properties = (properties || {});
};
AtumObject.prototype = new value.Value;
AtumObject.prototype.constructor = AtumObject;

AtumObject.prototype.type = type.OBJECT;

AtumObject.prototype.cls = "";

/**
 * Host toString conversion.
 */
AtumObject.prototype.toString = function() {
    return "{object " + this.cls + "}";
};

/**
 * Create a new object from the current object with properties `properties`.
 */
AtumObject.prototype.setProperties = function(properties) {
    return new AtumObject(this.proto, properties);
};

/**
 * Create a new object from the current object with prototype `proto`.
 */
AtumObject.prototype.setPrototype = function(proto) {
    return new AtumObject(proto, this.properties);
};

/**
 * Method that returns a computation for the default value for this object
 */
AtumObject.prototype.defaultValue = null;

/**
 * Method that returns a computation that checks if a given object is an instance
 * of this object.
 */
AtumObject.prototype.hasInstance = null;

/**
 * Get a list of names for all properties this object has.
 */
AtumObject.prototype.getOwnPropertyNames = function(propertyName) {
    return Object.getOwnPropertyNames(this.properties);
};

/**
 * Does this object have a property `name`?
 * 
 * Only checks this object, not prototype chain.
 * 
 * @param {String} name Property name.
 */
AtumObject.prototype.hasOwnProperty = function(propertyName) {
    return this.getOwnPropertyNames().indexOf(propertyName) !== -1;
};

/**
 * Returns the property descriptor for property 'name'.
 * 
 * Only checks this object, not prototype. Return null if this object does
 * not have property.
 * 
 * @param {String} name Property name.
 */
AtumObject.prototype.getOwnProperty = function(propertyName) {
    return (this.hasOwnProperty(propertyName) ?
        this.properties[propertyName] :
        null);
};

/**
 * Get a computation that returns whether this object has a property `name`.
 * 
 * Checks prototype chain if not found on this object.
 * 
 * @param ref Value reference to the object called on.
 * @param {String} name Property name.
 */
AtumObject.prototype.hasProperty = function(ref, name) {
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
AtumObject.prototype.getProperty = function(ref, name) {
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
 * Get a list of all enumerable property names for this object.
 */
AtumObject.prototype.getEnumerableProperties = function() {
    var self = this;
    return this.getOwnPropertyNames().filter(function(x) {
        return self.getOwnProperty(x).enumerable;
    });
};

/**
 * Computation that returns the value of property 'name'.
 * 
 * @param ref Value reference to the object called on.
 * @param {String} name Property name.
 */
AtumObject.prototype.get = function(ref, name) {
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
AtumObject.prototype.set = function(ref, name, value) {
    var self = this;
    return compute.bind(this.getProperty(ref, name), function(prop) {
        if (prop) {
            if (prop.set)
                return func.call(compute.just(prop.set), compute.just(ref), compute.enumeration(compute.just(value)));
            else if (prop.value && !prop.writable)
                return error.typeError(string.create(name + ' is not wriable'));
        }
        
        return self.defineProperty(ref, name, {
            'value': value,
            'writable': true,
            'enumerable': true,
            'configurable': true
        });
    });
};

/**
 * 
 */
AtumObject.prototype.deleteProperty = function(ref, propertyName, flag) { 
    return value_reference.modifyValue(ref, function(t) {
        return t.setProperties(
            amulet_object.deleteProperty(t.properties, propertyName));
    });
};

/**
 * 
 */
AtumObject.prototype.defineProperty = function(ref, name, desc) {
    return value_reference.modifyValue(ref, function(t) {
        return t.setProperties(
            amulet_object.defineProperty(t.properties, name, {
                'value': desc,
                'enumerable': true,
                'configurable': true
            }));
    });
};

/* Export
 ******************************************************************************/
return {
    'Object': AtumObject
};

});