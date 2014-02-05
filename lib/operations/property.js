/**
 * @fileOverview Property operations.
 */
define(['exports',
        'bes/object',
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
        'atum/value/undef',
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
        undef_value,
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
            boolean_value.create(desc.enumerable),
            property.ALL),
        
        'configurable': property.createValuePropertyFlags(
            boolean_value.create(desc.configurable),
            property.ALL)
    };
    
    if (property.isDataDescriptor(desc)) {
        properties['value'] = property.createValuePropertyFlags(
            desc.value || undef_value.UNDEFINED,
            property.ALL);
        
        properties['writable'] = property.createValuePropertyFlags(
            boolean_value.create(desc.writable),
            property.ALL);
    } else {
        properties['get'] = property.createValuePropertyFlags(
            desc.get || undef_value.UNDEFINED,
            property.ALL);
        
        properties['set'] = property.createValuePropertyFlags(
            desc.set || undef_value.UNDEFINED,
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
            if (!value.isObject(t))
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