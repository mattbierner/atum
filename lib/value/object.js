/**
 * @fileOverview
 */
define(['amulet/object',
        'atum/compute',
        'atum/value/value'],
function(amulet_object,
        compute,
        value) {
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
AtumObject.prototype.type = 'object';

AtumObject.prototype.toString = function() {
    var properties = this.properties;
    return "{" + printObj(this.properties) + "}";
};

AtumObject.prototype.get = function(propertyName) {
    return this.properties[propertyName].value;
};

AtumObject.prototype.deleteProperty = function(propertyName, flag) { };

AtumObject.prototype.defaultValue = function(hint) { };

AtumObject.prototype.defineOwnProperty = function(propertyName, propertyDescriptor, flag) { };

/*
 ******************************************************************************/
var create = function(proto, properties) {
    return new AtumObject(proto, properties);
};

var defineProperty = function(obj, name, desc) {
    return new AtumObject(obj.proto, amulet_object.defineProperty(obj.properties, name, {
        'value': desc,
        'enumerable': true
    }));
};

var defineProperty = function(obj, name, desc) {
    return new AtumObject(obj.proto, amulet_object.defineProperty(obj.properties, name, {
        'value': desc,
        'enumerable': true
    }));
};


/* Export
 ******************************************************************************/
return {
    'Object': AtumObject,
    
    'create': create,
    'defineProperty': defineProperty
    
};

});