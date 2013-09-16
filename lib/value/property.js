/**
 * @fileOverview
 */
define(['amulet/object'],
function(amulet_object) {
"use strict";

var hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

/* Property
 ******************************************************************************/
var Property = function(value, getter, setter, enumerable, writable, configurable) {
    this.value = value;
    this.getter = getter;
    this.setter = setter;
    this.enumerable = enumerable;
    this.writable = writable;
    this.configurable = configurable;
};

var createValueProperty = function(value, enumerable, writable, configurable) {
    return new Property(value, null, null, enumerable, writable, configurable);
};

var createAccessorProperty = function(getter, setter, enumerable, writable, configurable) {
    return new Property(null, getter, setter, enumerable, writable, configurable);
};

var isAccessorDescriptor = function(desc) {
    return desc && (hasOwnProperty(desc, 'get') || hasOwnProperty(desc, 'set'));
};

var isDataDescriptor = function(desc) {
    return desc && (hasOwnProperty(desc, 'value')|| hasOwnProperty(desc, 'writable'));
};

var isGenericDescriptor = function(desc) {
    return desc && !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
};

/* Export
 ******************************************************************************/
return {
    'Property': Property,
    'createValueProperty': createValueProperty,
    'createAccessorProperty': createAccessorProperty,
    
    'isAccessorDescriptor': isAccessorDescriptor,
    'isDataDescriptor': isDataDescriptor,
    'isGenericDescriptor': isGenericDescriptor
};

});