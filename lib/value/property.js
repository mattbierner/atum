/**
 * @fileOverview
 */
define(['amulet/object'],
function(amulet_object) {
"use strict";

var hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

/* Property
 * @TODO: revert to hasOwnProperty once toPropertyDesciptor fixed
 ******************************************************************************/

var createValueProperty = function(value, enumerable, writable, configurable) {
    return {
        'value': value,
        'enumerable': enumerable,
        'writable': writable,
        'configurable': configurable
    };
};

var createAccessorProperty = function(getter, setter, enumerable, configurable) {
    return {
        'get': getter,
        'set': setter,
        'enumerable': enumerable,
        'configurable': configurable
    };
};

var isAccessorDescriptor = function(desc) {
    return desc && (desc.get || desc.set); //(hasOwnProperty(desc, 'get') || hasOwnProperty(desc, 'set'));
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
    'createValueProperty': createValueProperty,
    'createAccessorProperty': createAccessorProperty,
    
    'isAccessorDescriptor': isAccessorDescriptor,
    'isDataDescriptor': isDataDescriptor,
    'isGenericDescriptor': isGenericDescriptor
};

});