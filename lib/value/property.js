/**
 * @fileOverview
 */
define(['amulet/object'],
function(amulet_object) {
"use strict";

var hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

/* Flags
 ******************************************************************************/
var ENUMERABLE = 1 << 0,
    CONFIGURABLE = 1 << 1,
    WRITABLE = 1 << 2;

/* Property
 ******************************************************************************/
var createValueProperty = function(value, enumerable, writable, configurable) {
    return {
        'value': value,
        'enumerable': !!enumerable,
        'writable': !!writable,
        'configurable': !!configurable
    };
};

var createValuePropertyFlags = function(value, flags) {
    return createValueProperty(
        value,
        flags & ENUMERABLE,
        flags & WRITABLE,
        flags & CONFIGURABLE);
};

var createAccessorProperty = function(getter, setter, enumerable, configurable) {
    return {
        'get': getter,
        'set': setter,
        'enumerable': enumerable,
        'configurable': configurable
    };
};

var createAccessorPropertyFlags = function(getter, setter, flags) {
    return createAccessorProperty(
        getter,
        setter,
        flags & ENUMERABLE,
        flags & CONFIGURABLE);
};


var isAccessorDescriptor = function(desc) {
    return desc && (hasOwnProperty(desc, 'get') || hasOwnProperty(desc, 'set'));
};

var isDataDescriptor = function(desc) {
    return desc && (hasOwnProperty(desc, 'value') || hasOwnProperty(desc, 'writable'));
};

var isGenericDescriptor = function(desc) {
    return desc && !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
};

/* Export
 ******************************************************************************/
return {
    'ENUMERABLE': ENUMERABLE,
    'CONFIGURABLE': CONFIGURABLE,
    'WRITABLE': WRITABLE,
    
    'createValueProperty': createValueProperty,
    'createValuePropertyFlags': createValuePropertyFlags,
    'createAccessorProperty': createAccessorProperty,
    'createAccessorPropertyFlags': createAccessorPropertyFlags,
    
    'isAccessorDescriptor': isAccessorDescriptor,
    'isDataDescriptor': isDataDescriptor,
    'isGenericDescriptor': isGenericDescriptor
};

});