/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_function',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/builtin/object',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        array,
        func_builtin,
        builtin_constructor,
        meta_func,
        meta_object,
        object_refs,
        boolean,
        error,
        func,
        number,
        object_operations,
        string,
        type_conversion,
        undef,
        value_reference,
        type,
        value){
//"use strict";

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
        return object_operations.create(object_refs.ObjectPrototype, {});
        
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
var Object = new builtin_constructor.BuiltinConstructor(
    func_builtin.Function, {
        'create': {
            'value': object_refs.ObjectCreate
        },
        'defineProperty': {
            'value': object_refs.ObjectDefineProperty
        },
        'defineProperties': {
            'value': object_refs.ObjectDefineProperties
        },
        'getOwnPropertyDescriptor': {
            'value': object_refs.ObjectGetOwnPropertyDescriptor
        },
        'getOwnPropertyNames': {
            'value': object_refs.ObjectGetOwnPropertyNames
        },
        'getPrototypeOf': {
            'value': object_refs.ObjectGetPrototypeOf
        },
        'keys': {
            'value': object_refs.ObjectKeys
        },
        'prototype': {
            'value': object_refs.ObjectPrototype
        }
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
            object_operations.construct(object_refs.Object, []),
            function(obj) {
                return object_operations.setPrototype(obj, (value.isNull(t) ? null : o));
            });
        return (properties && !value.isUndefined(properties) ?
            func.call(
                compute.just(object_refs.ObjectDefineProperties),
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
    return value_reference.dereference(args.getArg(0), function(obj) {
        if (!obj || !value.isObject(obj))
            return error.typeError();
        return array.create(obj.getEnumerableProperties().map(string.create));
    });
};

/**
 * `Object.defineProperties(obj, properties)`
 */
var objectDefineProperties = (function(){
    var getDescriptors = function(obj) {
        return value_reference.dereference(obj, function(o) {
            var names = o.getEnumerableProperties();
            return compute.enumerationa(names.map(function(p) {
                return compute.enumeration(
                    compute.just(p),
                    object_operations.toPropertyDescriptor(object_operations.get(obj, p)));
                }));
        });
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
                    function(descriptors) {
                        return descriptors.reduce(function(p, pair) {
                            return object_operations.defineProperty(p, pair[0], pair[1]);
                        }, compute.just(obj));
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
            type_conversion.toString(prop),
            object_operations.toPropertyDescriptor(compute.just(attributes)),
            function(name, desc) {
                return object_operations.defineProperty(compute.just(obj), name.value, desc);
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
        return array.create(obj.getOwnPropertyNames().map(string.create));
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
            type_conversion.toString(prop),
            function(name) {
                return object_operations.fromPropertyDescriptor(t.getOwnProperty(name.value));
            });
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
    'hasOwnProperty': {
        'value': object_refs.ObjectPrototypeHasOwnProperty
    },
    'isPrototypeOf': {
        'value': object_refs.ObjectPrototypeIsPrototypeOf
    },
    'propertyIsEnumerable': {
        'value':object_refs.ObjectPrototypePropertyIsEnumerable
    },
    'toString': {
        'value': object_refs.ObjectPrototypeToString
    },
    'valueOf': {
        'value': object_refs.ObjectPrototypeValueOf
    }
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
            return value_reference.dereferenceFrom(type_conversion.toObject(t), function(o) {
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
    return compute.bind(type_conversion.toObject(thisObj), function(o) {
        return compute.bind(value_reference.getValue(o), function(t) {
            return compute.just(t.primitiveValue || thisObj);
        });
    });
};

/**
 * `Object.prototype.hasOwnProperty(name)`
 */
var objectPrototypeHasOwnProperty = function(ref, thisObj, args) {
    return compute.binary(
        type_conversion.toObject(thisObj),
        type_conversion.toString(args.getArg(0)),
        function(o, v) {
            return boolean.from(
                object_operations.hasOwnProperty(o, v.value));
        });
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
    
    return function(ref, self, args) {
        var v = args.getArg(0);
        return value_reference.dereference(v, function(v) {
            if (!value.isObject(v))
                return boolean.FALSE;
            return compute.bind(
                compute.bind(value_reference.getValue(self), type_conversion.toObject),
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
        func.createConstructor('Object', 1, object_refs.ObjectPrototype, object_refs.Object.setValue(Object)),
        func_builtin.create(object_refs.ObjectCreate, 'create', 2, objectCreate),
        func_builtin.create(object_refs.ObjectDefineProperty, 'defineProperty', 3, objectDefineProperty),
        func_builtin.create(object_refs.ObjectDefineProperties, 'defineProperties', 3, objectDefineProperties),
        func_builtin.create(object_refs.ObjectGetOwnPropertyDescriptor, 'getOwnPropertyDescriptor', 2, objectGetOwnPropertyDescriptor),
        func_builtin.create(object_refs.ObjectGetOwnPropertyNames, 'getOwnPropertyNames', 1, objectGetOwnPropertyNames),
        func_builtin.create(object_refs.ObjectGetPrototypeOf, 'getGetPrototypeOf', 1, objectGetPrototypeOf),
        func_builtin.create(object_refs.ObjectKeys,'keys', 1, objectKeys),
        
        object_refs.ObjectPrototype.setValue(ObjectPrototype),
        func_builtin.create(object_refs.ObjectPrototypeHasOwnProperty, 'hasOwnProperty', 0, objectPrototypeHasOwnProperty),
        func_builtin.create(object_refs.ObjectPrototypeIsPrototypeOf, 'isPrototypeOf', 1, objectPrototypeIsPrototypeOf),
        func_builtin.create(object_refs.ObjectPrototypePropertyIsEnumerable, 'propertyIsEnumerable', 1, objectPrototypePropertyIsEnumerable),
        func_builtin.create(object_refs.ObjectPrototypeToString, 'toString', 0, objectPrototypeToString),
        func_builtin.create(object_refs.ObjectPrototypeValueOf, 'valueOf', 0, objectPrototypeValueOf));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Object', object_refs.Object);
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