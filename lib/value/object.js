/**
 * @fileOverview
 */
define(['amulet/object',
        'atum/compute',
        'atum/operations/func',
        'atum/operations/value_reference',
        'atum/operations/undef',
        'atum/value/value',
        'atum/value/type'],
function(amulet_object,
        compute,
        func,
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
AtumObject.prototype.type = type.OBJECT_TYPE;

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
 * Does this object have a property `name`.
 * 
 * Only checks this object, not prototype chain.
 * 
 * @param {String} name Property name.
 */
AtumObject.prototype.hasOwnProperty = function(propertyName) {
    return this.properties.hasOwnProperty(propertyName);
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
 * Get a computation that returns a computation that gets the property
 * descriptor for property 'name'.
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
 * Method that returns a computation that returns the value of property 'name'
 * for value reference 'ref'.
 * 
 * @param ref Value reference to the object called on.
 * @param {String} name Property name.
 */
AtumObject.prototype.get = function(ref, name) {
    return compute.bind(this.getProperty(ref, name), function(prop) {
        if (!prop)
            return undef.create();
        
        return (prop.get ?
            func.call(compute.just(prop.get), prop.get.getValue(), compute.just(ref), compute.sequence()) :
            compute.just(prop.value));
    });
};

/**
 */
AtumObject.prototype.set = function(ref, name, value) {
    var that = this;
    return compute.bind(this.getProperty(ref, name), function(prop) {
        if (!prop) {
            return that.defineProperty(ref, name, {
                'value': value,
                'writable': true,
                'enumerable': true,
                'configurable': true
            });
        }
        
        return (prop.set ?
            func.call(compute.just(prop.set), prop.set.getValue(), compute.just(ref), compute.sequence(compute.just(value))) :
            that.defineProperty(ref, name, {'value': value}));
    });
};


/**
 * 
 */
AtumObject.prototype.deleteProperty = function(propertyName, flag) { 
    return new AtumObject(
        this.proto,
        amulet_object.deleteProperty(this.properties, propertyName));
};


/**
 * 
 */
AtumObject.prototype.defineProperty = function(ref, name, desc) {
    return ref.setValue(
        new AtumObject(this.proto, amulet_object.defineProperty(this.properties, name, {
            'value': desc,
            'enumerable': true,
            'configurable': true
        })));
};

/* Export
 ******************************************************************************/
return {
    'Object': AtumObject
};

});