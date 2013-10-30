/**
 * @fileOverview
 */
define(['amulet/record'],
function(record) {
"use strict";

var hasProperty = function(x, name) {
    return x[name] !== undefined;
};

/* Flags
 ******************************************************************************/
var ENUMERABLE = 1 << 0,
    CONFIGURABLE = 1 << 1,
    WRITABLE = 1 << 2;

/* Property
 ******************************************************************************/
var Property = record.declare(null, [
    'enumerable',
    'configurable',
    'value',
    'writable',
    'get',
    'set']);

/* Creation
 ******************************************************************************/
var createValueProperty = function(value, enumerable, writable, configurable) {
    return Property.create(
        !!enumerable,
        !!configurable,
        value,
        !!writable,
        undefined,
        undefined);
};

var createValuePropertyFlags = function(value, flags) {
    return createValueProperty(
        value,
        flags & ENUMERABLE,
        flags & WRITABLE,
        flags & CONFIGURABLE);
};

var createAccessorProperty = function(getter, setter, enumerable, configurable) {
    return Property.create(
        !!enumerable,
        !!configurable,
        undefined,
        undefined,
        getter,
        setter);
};

var createAccessorPropertyFlags = function(getter, setter, flags) {
    return createAccessorProperty(
        getter,
        setter,
        flags & ENUMERABLE,
        flags & CONFIGURABLE);
};

/* Queries
 ******************************************************************************/
var isAccessorDescriptor = function(desc) {
    return desc && (hasProperty(desc, 'get') || hasProperty(desc, 'set'));
};

var isDataDescriptor = function(desc) {
    return desc && (hasProperty(desc, 'value') || hasProperty(desc, 'writable'));
};

var isGenericDescriptor = function(desc) {
    return desc && !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
};

var hasGetter = function(desc) {
    return isAccessorDescriptor(desc) && desc.get;
};

var hasSetter = function(desc) {
    return isAccessorDescriptor(desc) && desc.set;
};

var areDataDescriptorEqual = function(d1, d2) {
    return (d1.configurable == d2.configurable &&
        d1.enumerable == d2.enumerable &&
        d1.writable && d2.writable);
};

/* Export
 ******************************************************************************/
return {
    'ENUMERABLE': ENUMERABLE,
    'CONFIGURABLE': CONFIGURABLE,
    'WRITABLE': WRITABLE,
    
    
    'Property': Property,
    
    'createValueProperty': createValueProperty,
    'createValuePropertyFlags': createValuePropertyFlags,
    'createAccessorProperty': createAccessorProperty,
    'createAccessorPropertyFlags': createAccessorPropertyFlags,
    
    'isAccessorDescriptor': isAccessorDescriptor,
    'isDataDescriptor': isDataDescriptor,
    'isGenericDescriptor': isGenericDescriptor,
    
    'hasGetter': hasGetter,
    'hasSetter': hasSetter,
    
    'areDataDescriptorEqual': areDataDescriptorEqual
};

});