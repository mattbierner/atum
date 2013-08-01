/**
 * @fileOverview
 */

var HostObject = Object;

define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/array',
        'atum/builtin/builtin_function',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/builtin/object',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_array,
        builtin_function,
        meta_func,
        meta_object,
        object_refs,
        error,
        func,
        number,
        object_semantics,
        string,
        type_conversion,
        undef,
        value_reference_semantics,
        object,
        type,
        value){
"use strict";

/* Internal Operations
 ******************************************************************************/
/**
 * Convert a hosted object to a property descriptor.
 */
var toPropertyDescriptor = function(obj) {
    return compute.bind(
        value_reference_semantics.getValue(compute.just(obj)),
        function(t) {
            if (!(value.isNull(t) || value.isObject(t)))
                return error.typeError();
            
        });
};

/* Object
 ******************************************************************************/
/**
 * `Object`
 */
var Object = function() {
    meta_func.Function.call(this, this.proto, this.properties);
};
Object.prototype = new meta_func.Function;

Object.prototype.proto = null;//func.Function;

Object.prototype.properties = {
    'create': {
        'value': object_refs.ObjectCreate
    },
    'keys': {
        'value': object_refs.ObjectKeys
    },
    'prototype': {
        'value': object_refs.ObjectPrototype
    }
};

/**
 * `new Object()`
 */
Object.prototype.construct = function(args) {
    return (args.length ?
        type_conversion.toObject(compute.just(args.getArg(0))) :
        value_reference_semantics.create(new meta_object.Object(object_refs.ObjectPrototype, {})));
};

/**
 * `Object()`
 */
Object.prototype.call = function(ref, thisObj, args) {
    if (args.length < 1)
        return this.construct([]);
    
    
    var val = args.getArg(0);
    switch (value.type(val)) {
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return this.construct(args);
    default:
        return type_conversion.toObject(compute.just(val));
    }
};

/**
 * `Object.create`
 */
var objectCreate = function(ref, _, args) {
    if (args.length < 1)
        return error.typeError();
    
    var o = args.getArg(0),
        properties = args.getArg(1);
    
    return compute.bind(
        value_reference_semantics.getValue(compute.just(o)),
        function(t) {
            if (!(value.isNull(t) || value.isObject(t)))
                return error.typeError();
            return compute.bind(
                object_semantics.construct(compute.just(object_refs.Object), compute.sequence()),
                function(obj) {
                    return (properties ?
                        objectDefineProperties(obj, [properties]) :
                        compute.just(obj));
                });
        });
};


/**
 * `Object.keys`
 */
var objectKeys = function(ref, _, args) {
    var o = args.getArg(0);
    return compute.bind(
        value_reference_semantics.getValue(compute.just(o)),
        function(obj) {
            if (!obj || value.type(obj) !== type.OBJECT_TYPE)
                return error.typeError();
            
            var properties = obj.properties;
            var keys = HostObject.keys(properties).filter(function(x) {
                return properties[x].enumerable;
            });
            return keys.reduce(function(p, c, i) {
                return object_semantics.defineProperty(
                    p,
                    i + "", {
                        'value': string.create(c),
                        'writable': true,
                        'enumerable': true,
                        'configurable': true
                    });
            }, object_semantics.construct(
                compute.just(builtin_array.Array),
                compute.sequence(number.create(keys.length))));
        });
};

/**
 * `Object.defineProperties`
 */
var objectDefineProperties = function(_, args) {
    return compute.just(args.getArg(0));
};

/**
 * `Object.defineProperty`
 */
var objectDefineProperty = function(ref, _, args) {
    if (args.length < 1)
        return error.typeError();
    
    var obj = args.getArg(0),
        prop = args.getArg(1),
        attributes = args.getArg(2);
    
    return compute.bind(
        value_reference_semantics.getValue(compute.just(obj)),
        function(t) {
            if (!(value.type(t) === type.NULL_TYPE || value.type(t) === type.OBJECT_TYPE))
                return error.typeError();
        });
};



/* Object Prototype
 ******************************************************************************/
/**
 * 
 */
var objectPrototypeToString = function(ref, thisObj, args) {
    return compute.bind(value_reference_semantics.getValue(compute.just(thisObj)), function(t) {
        switch (value.type(t)) {
        case type.UNDEFINED_TYPE:
            return string.create("[object Undefined]");
        case type.NULL_TYPE:
            return string.create("[object Null]");
        default:
            return compute.bind(
                value_reference_semantics.getValue(type_conversion.toObject(compute.just(t))),
                function(o) {
                    return string.create("[object " + o.cls + "]");
                });
        }
    });
};

/**
 * 
 */
var ObjectPrototype = function() {
    meta_object.Object.call(this, this.proto, this.properties);
};
ObjectPrototype.prototype = new meta_object.Object;
ObjectPrototype.prototype.constructor = ObjectPrototype;
ObjectPrototype.prototype.cls = "Object";

ObjectPrototype.prototype.proto = null;

ObjectPrototype.prototype.properties = {
    'toString': {
        'value': object_refs.ObjectPrototypeToString
    },
   // 'valueOf': {
     //   'value': object_refs.ObjectPrototypeValueOf
    //},
    'prototype': {
        'value': object_refs.ObjectPrototype
    }
};

var objectPrototypeValueOf = function(ref, thisObj, args) {
    return compute.just(thisObj);
};


/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        object_refs.Object.setValue(new Object()),
        object_refs.ObjectCreate.setValue(builtin_function.create('create', 2, objectCreate)),
        object_refs.ObjectKeys.setValue(builtin_function.create('keys', 1, objectKeys)),
        
        object_refs.ObjectPrototype.setValue(new ObjectPrototype()),
        object_refs.ObjectPrototypeToString.setValue(builtin_function.create('toString', 0, objectPrototypeToString)),
        object_refs.ObjectPrototypeValueOf.setValue(builtin_function.create('valueOf', 0, objectPrototypeValueOf)));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Object = object_refs.Object;
exports.ObjectPrototype = object_refs.ObjectPrototype;

});