/**
 * @fileOverview
 */

var HostObject = Object;

define(['exports',
        'atum/compute',
        'atum/builtin/array',
        'atum/builtin/builtin_function',
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
        'atum/value/number',
        'atum/value/object',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        builtin_array,
        builtin_function,
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
        number_value,
        object,
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
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return object_operations.create(object_refs.ObjectPrototype, {});
        
    case type.STRING_TYPE:
    case type.NUMBER_TYPE:
    case type.BOOLEAN_TYPE:
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
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return this.construct(ref, args);
    default:
        return type_conversion.toObject(val);
    }
};
    
/**
 * `Object`
 */
var Object = new builtin_constructor.BuiltinConstructor(
    builtin_function.Function, {
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
var objectCreate = function(ref, _, args) {
    if (args.length < 1)
        return error.typeError();
    
    var o = args.getArg(0),
        properties = args.getArg(1);
    
    return compute.bind(
        value_reference.getFrom(compute.just(o)),
        function(t) {
            if (!(value.isNull(t) || value.isObject(t)))
                return error.typeError();
            var obj = object_operations.construct(object_refs.Object, []);
            return (properties && !value.isUndefined(properties) ?
                func.call(
                    compute.just(object_refs.ObjectDefineProperties),
                    compute.just(object_refs.Object),
                    compute.sequence(
                        obj,
                        compute.just(properties))) :
                obj);
    });
};

/**
 * `Object.keys(obj)`
 */
var objectKeys = function(ref, _, args) {
    return compute.bind(
        value_reference.getFrom(compute.just(args.getArg(0))),
        function(obj) {
            if (!obj || !value.isObject(obj))
                return error.typeError();
            
            var keys = obj.getEnumerableProperties();
            return keys.reduce(function(p, c, i) {
                return object_operations.defineProperty(
                    p,
                    i + "", {
                        'value': string.create(c),
                        'writable': true,
                        'enumerable': true,
                        'configurable': true
                    });
            }, object_operations.construct(
                builtin_array.Array,
                [new number_value.Number(keys.length)]));
        });
};

/**
 * `Object.defineProperties(obj, properties)`
 */
var objectDefineProperties = (function(){
    var getDescriptors = function(obj) {
        return compute.bind(
            value_reference.getFrom(compute.just(obj)),
            function(o) {
                var names = o.getEnumerableProperties();
                return compute.enumerationa(names.map(function(p) {
                    return compute.enumeration(
                        compute.just(p),
                        object_operations.toPropertyDescriptor(object_operations.get(obj, p)));
                    }));
            });
    };
    
    return function(ref, _, args) {
       if (args.length < 1)
            return error.typeError();
        
        var obj = args.getArg(0),
            properties = args.getArg(1);
        
        return compute.bind(
            value_reference.getFrom(compute.just(obj)),
            function(t) {
                if (!value.isObject(t))
                    return error.typeError();
                return compute.next(
                    compute.bind(
                        getDescriptors(properties),
                        function(descriptors) {
                            return descriptors.reduce(function(p, pair) {
                                return compute.bind(p, function(ref) {
                                    return compute.bind(value_reference.getFrom(compute.just(ref)), function(t){
                                        return t.defineProperty(ref, pair[0], pair[1]);
                                    });
                                });
                            }, compute.just(obj));
                        }),
                    compute.just(obj));
            });
    };
}())


/**
 * `Object.defineProperty(obj, prop, attributes)`
 */
var objectDefineProperty = function(ref, _, args) {
    if (args.length < 1)
        return error.typeError();
    
    var obj = args.getArg(0),
        prop = args.getArg(1),
        attributes = args.getArg(2);
    
    return compute.bind(
        value_reference.getFrom(compute.just(obj)),
        function(t) {
            if (!(value.isNull(t) || value.isObject(t)))
                return error.typeError();
            return compute.binary(
                type_conversion.toString(prop),
                object_operations.toPropertyDescriptor(compute.just(attributes)),
                function(name, desc) {
                    return t.defineProperty(obj, name.value, desc);
                });
        });
};

/**
 * `Object.getOwnPropertyDescriptor(obj, prop)`
 */
var objectGetOwnPropertyDescriptor = function(ref, _, args) {
    var obj = args.getArg(0),
        prop = args.getArg(1);
    
    return compute.bind(
        value_reference.getFrom(compute.just(obj)),
        function(t) {
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
    return compute.bind(
        value_reference.getFrom(compute.just(obj)),
        function(t) {
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
    return compute.bind(
        value_reference.getFrom(compute.just(thisObj)),
        function(t) {
            switch (value.type(t)) {
            case type.UNDEFINED_TYPE:
                return string.create("[object Undefined]");
            case type.NULL_TYPE:
                return string.create("[object Null]");
            default:
                return compute.bind(
                    value_reference.getFrom(type_conversion.toObject(t)),
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
    return compute.bind(type_conversion.toObject(thisObj), function(o) {
        return compute.bind(value_reference.getFrom(compute.just(o)), function(t) {
            return compute.just(t.primitiveValue || thisObj);
        });
    });
};

/**
 * `Object.prototype.hasOwnProperty(name)`
 */
var objectPrototypeHasOwnProperty = function(ref, thisObj, args) {
    return compute.bind(
        type_conversion.toString(args.getArg(0)),
        function(v) {
            return boolean.from(
                object_operations.hasOwnProperty(
                    type_conversion.toObject(thisObj),
                    v.value));
        });
};

/**
 * `Object.prototype.isPrototypeOf(v)`
 */
var objectPrototypeIsPrototypeOf = (function(){
    var loop = function(v, o) {
        if (!v.proto)
            return boolean.FALSE;
        return compute.bind(
            value_reference.getFrom(compute.just(v.proto)),
            function(v) {
                return (v === o ?
                    boolean.TRUE :
                    loop(v, o));
            });
    };
    
    return function(ref, self, args) {
        var v = args.getArg(0);
        return compute.bind(
            value_reference.getFrom(compute.just(v)),
            function(v) {
                if (!value.isObject(v))
                    return boolean.FALSE;
                return compute.bind(
                    compute.bind(value_reference.getFrom(compute.just(self)), type_conversion.toObject),
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
        compute.bind(value_reference.getFrom(compute.just(self)), type_conversion.toObject),
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
        builtin_function.create(object_refs.ObjectCreate, 'create', 2, objectCreate),
        builtin_function.create(object_refs.ObjectDefineProperty, 'defineProperty', 3, objectDefineProperty),
        builtin_function.create(object_refs.ObjectDefineProperties, 'defineProperties', 3, objectDefineProperties),
        builtin_function.create(object_refs.ObjectGetOwnPropertyDescriptor, 'getOwnPropertyDescriptor', 2, objectGetOwnPropertyDescriptor),
        builtin_function.create(object_refs.ObjectGetPrototypeOf, 'getGetPrototypeOf', 1, objectGetPrototypeOf),
        builtin_function.create(object_refs.ObjectKeys,'keys', 1, objectKeys),
        
        object_refs.ObjectPrototype.setValue(ObjectPrototype),
        builtin_function.create(object_refs.ObjectPrototypeHasOwnProperty, 'hasOwnProperty', 0, objectPrototypeHasOwnProperty),
        builtin_function.create(object_refs.ObjectPrototypeIsPrototypeOf, 'isPrototypeOf', 1, objectPrototypeIsPrototypeOf),
        builtin_function.create(object_refs.ObjectPrototypePropertyIsEnumerable, 'propertyIsEnumerable', 1, objectPrototypePropertyIsEnumerable),
        builtin_function.create(object_refs.ObjectPrototypeToString, 'toString', 0, objectPrototypeToString),
        builtin_function.create(object_refs.ObjectPrototypeValueOf, 'valueOf', 0, objectPrototypeValueOf));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Object = object_refs.Object;
exports.ObjectPrototype = object_refs.ObjectPrototype;

});