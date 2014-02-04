/**
 * @fileOverview `Object` builtin implementation.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/builtin/operations/object',
        'atum/operations/boolean',
        'atum/operations/construct',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/property',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/property',
        'atum/value/type',
        'atum/value/value',
        'text!atum/builtin/hosted/object.js'],
function(exports,
        compute,
        fun,
        builtin_object,
        meta_object,
        array,
        builtin_constructor,
        builtin_function,
        object_builtin,
        boolean,
        construct,
        error,
        evaluation,
        func,
        object,
        property_ops,
        string,
        type_conversion,
        value_reference,
        property,
        type,
        value){
"use strict";

/* Object
 ******************************************************************************/
/**
 * `new Object()`
 */
var ObjectConstruct = function(ref, args) {
    var val = args.getArg(0);
    switch (val.type) {
    case type.UNDEFINED:
    case type.NULL:
        return construct.create(builtin_object.ObjectPrototype, {}, true);
        
    case type.STRING:
    case type.NUMBER:
    case type.BOOLEAN:
        return type_conversion.toObject(val);
        
    default:
        return compute.just(val);
    }
};

/**
 * `Object()`
 */
var ObjectCall = function(ref, _, args) {
    var val = args.getArg(0);
    switch (val.type) {
    case type.UNDEFINED:
    case type.NULL:
        return construct.constructForward(ref, args);
    default:
        return type_conversion.toObject(val);
    }
};
    
/**
 * `Object`
 */
var ObjectProperties = {
    'create': property.createValuePropertyFlags(
        builtin_object.ObjectCreate,
        property.WRITABLE | property.CONFIGURABLE),

    'defineProperty': property.createValuePropertyFlags(
        builtin_object.ObjectDefineProperty,
        property.WRITABLE | property.CONFIGURABLE),

    'defineProperties': property.createValuePropertyFlags(
        builtin_object.ObjectDefineProperties,
        property.WRITABLE | property.CONFIGURABLE),

    'getOwnPropertyDescriptor': property.createValuePropertyFlags(
        builtin_object.ObjectGetOwnPropertyDescriptor,
        property.WRITABLE | property.CONFIGURABLE),

    'getOwnPropertyNames': property.createValuePropertyFlags(
        builtin_object.ObjectGetOwnPropertyNames,
        property.WRITABLE | property.CONFIGURABLE),

    'getPrototypeOf': property.createValuePropertyFlags(
        builtin_object.ObjectGetPrototypeOf,
        property.WRITABLE | property.CONFIGURABLE),

    'isExtensible': property.createValuePropertyFlags(
        builtin_object.ObjectIsExtensible,
        property.WRITABLE | property.CONFIGURABLE),

    'keys': property.createValuePropertyFlags(
        builtin_object.ObjectKeys,
        property.WRITABLE | property.CONFIGURABLE),
        
    'preventExtensions': property.createValuePropertyFlags(
        builtin_object.ObjectPreventExtensions,
        property.WRITABLE | property.CONFIGURABLE),

    'prototype': property.createValuePropertyFlags(
        builtin_object.ObjectPrototype)
};

/**
 * `Object.create(o, [properties])`
 */
var objectCreate = function(ref, thisObj, args) {
    var o = args.getArg(0),
        properties = args.getArg(1);
    
    return value_reference.dereference(o, function(t) {
        if (!value.isNull(t) && !value.isObject(t))
            return error.typeError();
        
        var obj = compute.bind(
            object_builtin.create(),
            function(obj) {
                return object.setPrototype(obj, (value.isNull(t) ? null : o));
            });
        
        return (value.isUndefined(properties) ? obj :
            func.call(
                builtin_object.ObjectDefineProperties,
                thisObj,
                compute.enumeration(
                    obj,
                    compute.just(properties))));
    });
};

/**
 * `Object.keys(obj)`
 */
var objectKeys = function(ref, _, args) {
    return value_reference.dereference(args.getArg(0), function(obj, ref) {
        if (!obj || !value.isObject(obj))
            return error.typeError();
        return compute.bind(
            object.getEnumerableProperties(ref),
            fun.compose(
                array.create,
                fun.curry(fun.map, string.create)));
    });
};

/**
 * `Object.defineProperties(obj, properties)`
 */
var objectDefineProperties = (function(){
    var getDescriptors = function(obj) {
        return compute.bind(
            object.getEnumerableProperties(obj),
            fun.compose(
                compute.enumerationa,
                fun.curry(fun.map, function(p) {
                    return compute.enumeration(
                        compute.just(p),
                        compute.bind(object.get(obj, p), property_ops.toPropertyDescriptor));
                })));
    };
    
    return function(ref, _, args) {
        var obj = args.getArg(0),
            properties = args.getArg(1);
        
        return compute.next(
            value_reference.dereference(obj, function(t) {
                if (!value.isObject(t))
                    return error.typeError();
                
                return compute.bind(
                    getDescriptors(properties),
                    function(props) {
                        return compute.enumerationa(
                            fun.map(function(pair) {
                                return object.defineProperty(obj, pair[0], pair[1]);
                            }, props));
                    });
            }),
            compute.just(obj));
    };
}())

/**
 * `Object.defineProperty(obj, prop, attributes)`
 */
var objectDefineProperty = function(ref, _, args) {
    var obj = args.getArg(0),
        prop = args.getArg(1),
        attributes = args.getArg(2);
    
    return value_reference.dereference(obj, function(t) {
        if (!(value.isNull(t) || value.isObject(t)))
            return error.typeError();
        
        return compute.binary(
            string.toHost(prop),
            property_ops.toPropertyDescriptor(attributes),
            fun.curry(object.defineProperty, obj));
    });
};
/**
 * `Object.getOwnPropertyNames(obj)`
 */
var objectGetOwnPropertyNames = function(ref, _, args) {
    return value_reference.dereference(args.getArg(0), function(obj) {
        if (!value.isObject(obj))
            return error.typeError();
        return compute.bind(
            object.getOwnPropertyNames(obj),
            fun.compose(
                array.create,
                fun.curry(fun.map, string.create)));
    });
};

/**
 * `Object.getOwnPropertyDescriptor(obj, prop)`
 */
var objectGetOwnPropertyDescriptor = function(ref, _, args) {
    var obj = args.getArg(0),
        prop = args.getArg(1);
    
    return value_reference.dereference(obj, function(t) {
        if (!value.isObject(t))
            return error.typeError();
        
        return compute.bind(
            string.toHost(prop),
            compute.compose(
                fun.curry(object.getOwnProperty, obj),
                property_ops.fromPropertyDescriptor));
    });
};

/**
 * `Object.getPrototypeOf(obj)`
 */
var objectGetPrototypeOf = function(ref, _, args) {
    var obj = args.getArg(0);
    return value_reference.dereference(obj, function(t) {
        if (!value.isObject(t))
            return error.typeError();
        return compute.just(t.proto);
    });
};

/**
 * `Object.preventExtensions(obj)`
 */
var objectPreventExtensions = function(ref, _, args) {
    var obj = args.getArg(0);
    return value_reference.dereference(obj, function(t) {
        if (!value.isObject(t))
            return error.typeError();
        return compute.next(
            object.setExtensibility(obj, false),
            compute.just(obj));
    });
};

/**
 * `Object.isExtensible(obj)`
 */
var objectIsExtensible = function(ref, _, args) {
    var obj = args.getArg(0);
    return value_reference.dereference(obj, function(t) {
        if (!value.isObject(t))
            return error.typeError();
        return boolean.create(t.extensible);
    });
};

/* Object Prototype
 ******************************************************************************/
/**
 * `Object.prototype`
 */
var ObjectPrototype = new meta_object.Object(
    null, {
        'hasOwnProperty': property.createValuePropertyFlags(
            builtin_object.ObjectPrototypeHasOwnProperty,
            property.WRITABLE | property.CONFIGURABLE),
        
        'isPrototypeOf': property.createValuePropertyFlags(
            builtin_object.ObjectPrototypeIsPrototypeOf,
            property.WRITABLE | property.CONFIGURABLE),
        
        'propertyIsEnumerable': property.createValuePropertyFlags(
            builtin_object.ObjectPrototypePropertyIsEnumerable,
            property.WRITABLE | property.CONFIGURABLE),
        
        'toString': property.createValuePropertyFlags(
            builtin_object.ObjectPrototypeToString,
            property.WRITABLE | property.CONFIGURABLE),
        
        'valueOf': property.createValuePropertyFlags(
            builtin_object.ObjectPrototypeValueOf,
            property.WRITABLE | property.CONFIGURABLE),
    },
    true);

/**
 * 
 */
var objectPrototypeToString = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        switch (t.type) {
        case type.UNDEFINED:
            return string.create("[object Undefined]");
        case type.NULL:
            return string.create("[object Null]");
        default:
            return value_reference.dereferenceFrom(
                type_conversion.toObject(t),
                function(o) {
                    return string.create("[object " + o.cls + "]");
                });
        }
    });
};

/**
 * `Object.prototype.valueOf()`
 * 
 * Get the primitive value of this, if any. Otherwise, return this as an object.
 */
var objectPrototypeValueOf = function(ref, thisObj, args) {
    return value_reference.dereferenceFrom(
        type_conversion.toObject(thisObj),
        function(val, ref) {
            return compute.just(val.primitiveValue || ref);
        });
};

/**
 * `Object.prototype.hasOwnProperty(name)`
 */
var objectPrototypeHasOwnProperty = function(ref, thisObj, args) {
    return boolean.from(
        compute.binary(
            type_conversion.toObject(thisObj),
            string.toHost(args.getArg(0)),
            object.hasOwnProperty));
};

/**
 * `Object.prototype.isPrototypeOf(v)`
 */
var objectPrototypeIsPrototypeOf = (function(){
    var loop = function(v, o) {
        if (!v.proto)
            return boolean.FALSE;
        
        return value_reference.dereference(v.proto, function(v) {
            return (v === o ?
                boolean.TRUE :
                loop(v, o));
        });
    };
    
    return function(ref, thisObj, args) {
        var v = args.getArg(0);
        return value_reference.dereference(v, function(v) {
            if (!value.isObject(v))
                return boolean.FALSE;
            return compute.bind(
                compute.bind(value_reference.getValue(thisObj), type_conversion.toObject),
                function(o) {
                    return loop(v, o);
                });
        });
    };
}());

/**
 * `Object.prototype.propertyIsEnumerable(v)`
 */
var objectPrototypePropertyIsEnumerable = function(ref, self, args) {
    var v = args.getArg(0);
    return compute.binary(
        string.toHost(v),
        compute.bind(value_reference.getValue(self), type_conversion.toObject),
        function(p, o) {
            var prop = o.getOwnProperty(p);
            return boolean.create(prop && prop.enumerable);
        });
};

/* Initialization
 ******************************************************************************/
var preinit = function() {
    return compute.sequence(
        builtin_object.ObjectPrototype.setValue(ObjectPrototype));
};

var initialize = function() {
    return compute.sequence(
        builtin_constructor.create(builtin_object.Object, 'Object', 1, ObjectProperties, ObjectCall, ObjectConstruct),
        builtin_function.create(builtin_object.ObjectCreate, 'create', 2, objectCreate),
        builtin_function.create(builtin_object.ObjectDefineProperty, 'defineProperty', 3, objectDefineProperty),
        builtin_function.create(builtin_object.ObjectDefineProperties, 'defineProperties', 3, objectDefineProperties),
        builtin_function.create(builtin_object.ObjectGetOwnPropertyDescriptor, 'getOwnPropertyDescriptor', 2, objectGetOwnPropertyDescriptor),
        builtin_function.create(builtin_object.ObjectGetOwnPropertyNames, 'getOwnPropertyNames', 1, objectGetOwnPropertyNames),
        builtin_function.create(builtin_object.ObjectGetPrototypeOf, 'getGetPrototypeOf', 1, objectGetPrototypeOf),
        builtin_function.create(builtin_object.ObjectKeys,'keys', 1, objectKeys),
        builtin_function.create(builtin_object.ObjectIsExtensible,'isExtensible', 1, objectIsExtensible),
        builtin_function.create(builtin_object.ObjectPreventExtensions,'preventExtensions', 1, objectPreventExtensions),

        builtin_function.create(builtin_object.ObjectPrototypeHasOwnProperty, 'hasOwnProperty', 0, objectPrototypeHasOwnProperty),
        builtin_function.create(builtin_object.ObjectPrototypeIsPrototypeOf, 'isPrototypeOf', 1, objectPrototypeIsPrototypeOf),
        builtin_function.create(builtin_object.ObjectPrototypePropertyIsEnumerable, 'propertyIsEnumerable', 1, objectPrototypePropertyIsEnumerable),
        builtin_function.create(builtin_object.ObjectPrototypeToString, 'toString', 0, objectPrototypeToString),
        builtin_function.create(builtin_object.ObjectPrototypeValueOf, 'valueOf', 0, objectPrototypeValueOf));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Object', builtin_object.Object);
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/object.js');
};

/* Export
 ******************************************************************************/
exports.preinit = preinit;
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});