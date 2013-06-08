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
 * 
 */
var getOwnProperty = function(obj, propertyName) {
    return (obj.properties.hasOwnProperty(propertyName) ?
        obj.properties[propertyName] :
        null);
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
var deleteOwnProperty = function(obj, propertyName) { 
    return new AtumObject(
        obj.proto,
        amulet_object.deleteProperty(obj.properties, propertyName));
};

/**
 * 
 */
AtumObject.prototype.getProperty = function(propertyName) {
    var prop = getOwnProperty(this, propertyName);
    return (prop ?
        compute.always(prop) :
        (this.proto ?
            compute.bind(
                value_reference.getValue(compute.always(this.proto)),
                function(proto) {
                    return proto.getProperty(propertyName);
                }) :
            compute.always(null)));
};

/**
 * 
 */
AtumObject.prototype.deleteProperty = function(propertyName, flag) { 
    return new AtumObject(
        this.proto,
        amulet_object.deleteProperty(this.properties, propertyName));
};

AtumObject.prototype.get = function(ref, name) {
    return compute.bind(this.getProperty(name), function(prop) {
        if (!prop) {
            return undef.create();
        }
        return (prop.get ?
            prop.get.call(ref, []) :
            compute.always(prop.value));
    });
};

/**
 * The default value of an object.
 */
AtumObject.prototype.defaultValue = function(hint) { 
    var that = this;
    return compute.bind(value_reference.getValue(that.get("toString")), function(toString) {
        if (toString && value.isCallable(toString)) {
            return toString.call(that, []);
        }
        return compute.bind(value_reference.getValue(that.get("valueOf")), function(toString) {
            return valueOf.call(that, []);
        });
    });
};

/**
 * 
 */
var defineProperty = function(obj, name, desc) {
    return new AtumObject(obj.proto, amulet_object.defineProperty(obj.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    }));
};

/**
 * 
 */
var defineProperties = function(obj, props) {
    return Object.keys(props).reduce(function(o, k) {
        return defineProperty(o, k, props[k]);
    }, obj)
};

/* Export
 ******************************************************************************/
return {
    'Object': AtumObject,
        
    'getOwnProperty': getOwnProperty,
    'defineOwnProperty': defineOwnProperty,
    
    'defineProperty': defineProperty
    
};

});