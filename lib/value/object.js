/**
 * @fileOverview
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
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
 * Get a list of all enumerable property names for this object.
 */
AtumObject.prototype.getEnumerableProperties = function() {
    var self = this;
    return this.getOwnPropertyNames().filter(function(x) {
        return self.getOwnProperty(x).enumerable;
    });
};

/* Export
 ******************************************************************************/
return {
    'Object': AtumObject
};

});