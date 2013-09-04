/**
 * @fileOverview
 */
define(['amulet/object'],
function(amulet_object) {
//"use strict";

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
}

/* Export
 ******************************************************************************/
return {
    'Property': Property,
    'createValueProperty': createValueProperty,
    'createAccessorProperty': createAccessorProperty
};

});