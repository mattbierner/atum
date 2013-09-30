/**
 * @fileOverview
 */
var getOwnPropertyNames = Object.getOwnPropertyNames;

define(['atum/value/type',
        'atum/value/value'],
function(type,
        value) {
"use strict";

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function(proto, properties) {
    value.Value.call(this);
    this.proto = proto;
    this.properties = (properties || {});
};
Object.prototype = new value.Value;
Object.prototype.constructor = Object;

Object.prototype.type = type.OBJECT;

/**
 * Host toString conversion.
 */
Object.prototype.toString = function() {
    return "{object " + this.cls + "}";
};

/**
 * Create a new object from the current object with properties `properties`.
 */
Object.prototype.setProperties = function(properties) {
    return new Object(this.proto, properties);
};

/**
 * Create a new object from the current object with prototype `proto`.
 */
Object.prototype.setPrototype = function(proto) {
    return new Object(proto, this.properties);
};

/**
 * Get a list of names for all properties this object has.
 */
Object.prototype.getOwnPropertyNames = function(propertyName) {
    return getOwnPropertyNames(this.properties);
};

/**
 * Does this object have a property `name`?
 * 
 * Only checks this object, not prototype chain.
 * 
 * @param {String} name Property name.
 */
Object.prototype.hasOwnProperty = function(propertyName) {
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
Object.prototype.getOwnProperty = function(propertyName) {
    return (this.hasOwnProperty(propertyName) ?
        this.properties[propertyName] :
        null);
};

/**
 * Get a list of all enumerable property names for this object.
 */
Object.prototype.getEnumerableProperties = function() {
    var self = this;
    return this.getOwnPropertyNames().filter(function(x) {
        return self.getOwnProperty(x).enumerable;
    });
};

/* Export
 ******************************************************************************/
return {
    'Object': Object
};

});