/**
 * @fileOverview Property operations.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/operations/object',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/boolean',
        'atum/value/property',
        'atum/value/value'],
function(exports,
        amulet_object,
        compute,
        object_builtin,
        boolean,
        error,
        func,
        object,
        string,
        undef,
        value_reference,
        boolean_value,
        property,
        value) {
"use strict";

/* Descriptor Operations
 ******************************************************************************/
/**
 * Create a hosted object from a property descriptor.
 */
var fromPropertyDescriptor = function(desc) {
    if (!desc)
        return undef.UNDEFINED;
    
    var properties = {
        'enumerable':  property.createValuePropertyFlags(
            new boolean_value.Boolean(desc.enumerable),
            property.ALL),
        
        'configurable': property.createValuePropertyFlags(
            new boolean_value.Boolean(desc.configurable),
            property.ALL)
    };
    
    if (property.isDataDescriptor(desc)) {
        properties['value'] = property.createValuePropertyFlags(
            desc.value,
            property.ALL);
        
        properties['writable'] = property.createValuePropertyFlags(
            new boolean_value.Boolean(desc.writable),
            property.ALL);
    } else {
        properties['get'] = property.createValuePropertyFlags(
            desc.get,
            property.ALL);
        
        properties['set'] = property.createValuePropertyFlags(
            desc.set,
            property.ALL);
    }
    
    return compute.bind(object_builtin.create(), function(obj) {
        return object.defineProperties(obj, properties)
    });
};
/**
 * Convert a hosted object to a property descriptor.
 * 
 * @TODO: ugly
 */
var toPropertyDescriptor = (function(){
    var getProperty = function(obj, prop, f, desc) {
        return compute.branch(object.hasProperty(obj, prop),
            compute.binds(
                compute.enumeration(
                    compute.bind(object.get(obj, prop), f),
                    desc),
                function(x, desc) {
                    return compute.just(amulet_object.setProperty(desc, prop, x, true));
                }),
            desc);
    };
    
    var isCallable = function(ref) {
        return compute.branch(func.isCallable(ref),
            compute.just(ref),
            error.typeError());
    };
    
    return function(obj) {
        return value_reference.dereference(obj, function(t) {
            if (!(value.isNull(t) || value.isObject(t)))
                return error.typeError();
            
            return compute.bind(
                getProperty(t, 'set', isCallable,
                getProperty(t, 'get', isCallable,
                getProperty(t, 'writable', boolean.isTrue,
                getProperty(t, 'value', compute.just,
                getProperty(t, 'configurable', boolean.isTrue,
                getProperty(t, 'enumerable', boolean.isTrue,
                compute.just(new property.Property))))))),
                function(desc) {
                    if (desc.get || desc.set) {
                        if (desc.value || desc.writable)
                            return error.typeError();
                    }
                    return compute.just(desc);
                });
        });
    };
}());

/* Exports
 ******************************************************************************/
exports.fromPropertyDescriptor = fromPropertyDescriptor;
exports.toPropertyDescriptor = toPropertyDescriptor;

});