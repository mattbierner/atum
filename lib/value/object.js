/**
 * @fileOverview
 */
var getOwnPropertyNames = Object.getOwnPropertyNames;
var keys = Object.keys;

define(['bes/record',
        'bes/object',
        'atum/value/type',
        'atum/value/value'],
function(record,
        amulet_object,
        type,
        value) {
"use strict";

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = record.extend(value.Value, [
    'proto',
    'properties',
    'extensible'],
    function(proto, properties, extensible) {
        this.proto = proto;
        this.properties = properties;
        this.extensible = extensible;
    });

Object.prototype.type = type.OBJECT;

/**
 * Host toString conversion.
 */
Object.prototype.toString = function() {
    return "{object " + this.cls + "}";
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
    return (this.getOwnPropertyNames().indexOf(propertyName) >= 0);
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

/**
 * Set a property.
 * 
 * Return a copy of this object with the property set.
 */
Object.prototype.setProperty = function(name, desc) {
    return this.setProperties(
        amulet_object.setProperty(this.properties, name, desc, true));
};
/**
 * Removed a property.
 * 
 * Return a copy of this object with the property removed.
 */
Object.prototype.removeProperty = function(name) {
    return this.setProperties(
        amulet_object.deleteProperty(this.properties, name));
};

/* Export
 ******************************************************************************/
return {
    'Object': Object
};

});