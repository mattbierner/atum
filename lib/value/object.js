/**
 * @fileOverview
 */
define(['amulet/object',
        'atum/compute',
        'atum/value/value',
        'atum/value/type'],
function(amulet_object,
        compute,
        value,
        type) {
//"use strict";

var printObj = function(obj) {
    if (!(obj instanceof Object)) {
        return "" + obj;
    }   
    return Object.keys(obj).reduce(function(p, c) {
        return p + " " + c + ": " + printObj(obj[c]);
    }, "");
};


/* Atum Object
 ******************************************************************************/
var AtumObject = function(proto, properties) {
    value.Value.call(this);
    this.proto = proto;
    this.properties = (properties || {});
};
AtumObject.prototype = new value.Value;
AtumObject.prototype.type = type.OBJECT_TYPE;

AtumObject.prototype.toString = function() {
    var properties = this.properties;
    return "{" + printObj(this.properties) + "}";
};

/**
 * 
 */
AtumObject.prototype.getOwnProperty = function(propertyName) {
    return (this.properties.hasOwnProperty(propertyName) ?
        this.properties[propertyName] :
        null);
};

/**
 * 
 */
AtumObject.prototype.getProperty = function(propertyName) {
    var prop = this.getOwnProperty(propertyName);
    return (prop ?
        prop :
        (this.proto ?
            this.proto.getProperty(propertyName) :
            null));
};

/**
 * 
 */
AtumObject.prototype.defineOwnProperty = function(propertyName, propertyDescriptor, flag) { 
    return new AtumObject(
        this.proto,
        amulet_object.defineProperty(this.properties, propertyName, {
            'value': propertyDescriptor,
            'enumerable': true,
            'configurable': true
        }));
};

AtumObject.prototype.deleteProperty = function(propertyName, flag) { 
    return new AtumObject(
        this.proto,
        amulet_object.deleteProperty(this.properties, propertyName));
};

AtumObject.prototype.defaultValue = function(hint) { 
    var toString = this.get("toString");
    if (value.isCallable(toString)) {
        return toString.call(this, []);
    }
    var valueOf = this.get("valueOf");
    if (value.isCallable(valueOf)) {
        return valueOf.call(this, []);
    }
    throw "TypeError";
};

/*
 ******************************************************************************/
/**
 * 
 */
var create = function(proto, properties) {
    return new AtumObject(proto, properties);
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
    
    'create': create,
    'defineProperty': defineProperty
    
};

});