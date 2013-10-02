/**
 * @fileOverview `Object` builtin implementation.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/object',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/property',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        func_builtin,
        object_builtin,
        meta_builtin_constructor,
        meta_object,
        array,
        builtin_constructor,
        builtin_function,
        boolean,
        error,
        func,
        object,
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
    switch (value.type(val)) {
    case type.UNDEFINED:
    case type.NULL:
        return object.create(object_builtin.ObjectPrototype, {});
        
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
    switch (value.type(val)) {
    case type.UNDEFINED:
    case type.NULL:
        return this.construct(ref, args);
    default:
        return type_conversion.toObject(val);
    }
};
    
/**
 * `Object`
 */
var Object = new meta_builtin_constructor.BuiltinConstructor(
    func_builtin.Function, {
        'create': property.createValuePropertyFlags(
            object_builtin.ObjectCreate,
            property.WRITABLE | property.CONFIGURABLE),

        'defineProperty': property.createValuePropertyFlags(
            object_builtin.ObjectDefineProperty,
            property.WRITABLE | property.CONFIGURABLE),

        'defineProperties': property.createValuePropertyFlags(
            object_builtin.ObjectDefineProperties,
            property.WRITABLE | property.CONFIGURABLE),

        'getOwnPropertyDescriptor': property.createValuePropertyFlags(
            object_builtin.ObjectGetOwnPropertyDescriptor,
            property.WRITABLE | property.CONFIGURABLE),

        'getOwnPropertyNames': property.createValuePropertyFlags(
            object_builtin.ObjectGetOwnPropertyNames,
            property.WRITABLE | property.CONFIGURABLE),

        'getPrototypeOf': property.createValuePropertyFlags(
            object_builtin.ObjectGetPrototypeOf,
            property.WRITABLE | property.CONFIGURABLE),

        'keys': property.createValuePropertyFlags(
            object_builtin.ObjectKeys,
            property.WRITABLE | property.CONFIGURABLE),

        'prototype': property.createValuePropertyFlags(
            object_builtin.ObjectPrototype),
    },
    ObjectCall,
    ObjectConstruct);

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
            object.construct(object_builtin.Object, []),
            function(obj) {
                return object.setPrototype(obj, (value.isNull(t) ? null : o));
            });
        return (properties && !value.isUndefined(properties) ?
            func.call(
                compute.just(object_builtin.ObjectDefineProperties),
                compute.just(thisObj),
                compute.enumeration(
                    obj,
                    compute.just(properties))) :
            obj);
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
                        compute.bind(object.get(obj, p), object.toPropertyDescriptor));
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
                    fun.curry(fun.reduce, function(p, pair) {
                        return object.defineProperty(p, pair[0], pair[1]);
                    }, compute.just(obj)));
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
            type_conversion.toString(prop),
            object.toPropertyDescriptor(attributes),
            function(name, desc) {
                return object.defineProperty(compute.just(obj), name.value, desc);
            });
    });
};
/**
 * `Object.getOwnPropertyNames(obj)`
 */
var objectGetOwnPropertyNames = function(ref, _, args) {
    return value_reference.dereference(args.getArg(0), function(obj) {
        if (!obj || !value.isObject(obj))
            return error.typeError();
        return array.create(fun.map(string.create, obj.getOwnPropertyNames));
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
        return object.fromPropertyDescriptor(
            compute.bind(
                type_conversion.toString(prop),
                function(name) {
                    return compute.just(t.getOwnProperty(name.value));
                }));
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


/* Object Prototype
 ******************************************************************************/
/**
 * `Object.prototype`
 */
var ObjectPrototype = new meta_object.Object(null, {
    'hasOwnProperty': property.createValuePropertyFlags(
        object_builtin.ObjectPrototypeHasOwnProperty,
        property.WRITABLE | property.CONFIGURABLE),
    
    'isPrototypeOf': property.createValuePropertyFlags(
        object_builtin.ObjectPrototypeIsPrototypeOf,
        property.WRITABLE | property.CONFIGURABLE),
    
    'propertyIsEnumerable': property.createValuePropertyFlags(
        object_builtin.ObjectPrototypePropertyIsEnumerable,
        property.WRITABLE | property.CONFIGURABLE),
    
    'toString': property.createValuePropertyFlags(
        object_builtin.ObjectPrototypeToString,
        property.WRITABLE | property.CONFIGURABLE),
    
    'valueOf': property.createValuePropertyFlags(
        object_builtin.ObjectPrototypeValueOf,
        property.WRITABLE | property.CONFIGURABLE),
});

/**
 * 
 */
var objectPrototypeToString = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        switch (value.type(t)) {
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
            type_conversion.toString(args.getArg(0)),
            function(o, v) {
                return object.hasOwnProperty(o, v.value);
            }));
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
        type_conversion.toString(v),
        compute.bind(value_reference.getValue(self), type_conversion.toObject),
        function(p, o) {
            var prop = o.getOwnProperty(p.value);
            return boolean.create(prop && prop.enumerable);
        });
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        builtin_constructor.create('Object', 1, object_builtin.ObjectPrototype, object_builtin.Object.setValue(Object)),
        builtin_function.create(object_builtin.ObjectCreate, 'create', 2, objectCreate),
        builtin_function.create(object_builtin.ObjectDefineProperty, 'defineProperty', 3, objectDefineProperty),
        builtin_function.create(object_builtin.ObjectDefineProperties, 'defineProperties', 3, objectDefineProperties),
        builtin_function.create(object_builtin.ObjectGetOwnPropertyDescriptor, 'getOwnPropertyDescriptor', 2, objectGetOwnPropertyDescriptor),
        builtin_function.create(object_builtin.ObjectGetOwnPropertyNames, 'getOwnPropertyNames', 1, objectGetOwnPropertyNames),
        builtin_function.create(object_builtin.ObjectGetPrototypeOf, 'getGetPrototypeOf', 1, objectGetPrototypeOf),
        builtin_function.create(object_builtin.ObjectKeys,'keys', 1, objectKeys),
        
        object_builtin.ObjectPrototype.setValue(ObjectPrototype),
        builtin_function.create(object_builtin.ObjectPrototypeHasOwnProperty, 'hasOwnProperty', 0, objectPrototypeHasOwnProperty),
        builtin_function.create(object_builtin.ObjectPrototypeIsPrototypeOf, 'isPrototypeOf', 1, objectPrototypeIsPrototypeOf),
        builtin_function.create(object_builtin.ObjectPrototypePropertyIsEnumerable, 'propertyIsEnumerable', 1, objectPrototypePropertyIsEnumerable),
        builtin_function.create(object_builtin.ObjectPrototypeToString, 'toString', 0, objectPrototypeToString),
        builtin_function.create(object_builtin.ObjectPrototypeValueOf, 'valueOf', 0, objectPrototypeValueOf));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Object', object_builtin.Object);
};

var execute = function() {
    return compute.empty;
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});