/**
 * @fileOverview
 */
define(['amulet/object',
        'atum/compute',
        'atum/value/value',
        'atum/value/type',
        'atum/operations/value_reference',
        'atum/operations/undef'],
function(amulet_object,
        compute,
        value,
        type,
        value_reference,
        undef) {
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
 * Returns the property descriptor for property 'name'.
 * 
 * Only checks this object, not prototype. Return null if this object does
 * not have property.
 * 
 * @param {String} name Property name.
 */
AtumObject.prototype.getOwnProperty = function(propertyName) {
    return (this.properties.hasOwnProperty(propertyName) ?
        this.properties[propertyName] :
        null);
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
    if (prop) {
        return compute.always(prop);
    }
    var protoRef = this.proto;
    console.log(protoRef);
    return (protoRef ?
        compute.bind(protoRef.getValue(), function(proto) {
            return proto.getProperty(protoRef, name);
        }) :
        compute.always(null));
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
        if (!prop) {
            return undef.create();
        }
        return (prop.get ?
            compute.bind(prop.get.getValue(), function(getter) {
                return getter.call(prop.get, ref, []);
            }) :
            compute.always(prop.value));
    });
};

/**
 */
AtumObject.prototype.set = function(ref, name, value) {
    var that = this;
    return compute.bind(this.getProperty(ref, name), function(prop) {
        if (!prop) {
            return ref.setValue(that.defineProperty(name, {'value': value}));
        }
        return (prop.set ?
            compute.bind(prop.set.getValue(), function(setter) {
                return setter.call(prop.set, ref, [value]);
            }) :
            ref.setValue(that.defineProperty(name, {'value': value})));
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
var defineOwnProperty = function(obj, propertyName, propertyDescriptor) { 
    return amulet_object.defineProperty(obj, 'property', {
        'value': amulet_object.defineProperty(obj.properties, propertyName, {
            'value': propertyDescriptor,
            'enumerable': true,
            'configurable': true
        })
    });
};


/**
 * 
 */
AtumObject.prototype.defineProperty = function(name, desc) {
    return new AtumObject(this.proto, amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    }));
};

/* Export
 ******************************************************************************/
return {
    'Object': AtumObject
};

});