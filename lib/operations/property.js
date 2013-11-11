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
    var id = function(x) { return x; };
    
    var getProperty = function(obj, prop, f, desc) {
        return compute.bind(obj, function(o) {
            return compute.branch(object.hasProperty(o, prop),
                compute.binds(
                    compute.enumeration(
                        f(compute.bind(obj, function(o){ return object.get(o, prop); })),
                        desc),
                    function(x, desc) {
                        return compute.just(amulet_object.setProperty(desc, prop, x, true));
                    }),
                desc);
        });
    };
    
    var isCallable = function(v) {
        return compute.bind(v, function(ref){
            return compute.branch(func.isCallable(ref),
                compute.just(ref),
                error.typeError());
        });
    };
    
    var toBoolean = function(c) {
        return compute.bind(c, boolean.isTrue);
    };
    
    return function(obj) {
        return value_reference.dereference(obj, function(t) {
            if (!(value.isNull(t) || value.isObject(t)))
                return error.typeError();
            
            var self = compute.just(t);
            return compute.bind(
                    getProperty(self, 'set', isCallable,
                    getProperty(self, 'get', isCallable,
                    getProperty(self, 'writable', toBoolean,
                    getProperty(self, 'value', id,
                    getProperty(self, 'configurable', toBoolean,
                    getProperty(self, 'enumerable', toBoolean, compute.just({}))))))),
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
// Descriptor Operations
exports.fromPropertyDescriptor = fromPropertyDescriptor;
exports.toPropertyDescriptor = toPropertyDescriptor;

});