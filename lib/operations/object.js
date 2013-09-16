/**
 * 
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/property_reference',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/property',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        amulet_object,
        compute,
        builtin_object,
        meta_object,
        boolean,
        error,
        property_reference,
        type_conversion,
        undef,
        value_reference,
        args,
        property,
        type,
        value) {
//"use strict";

var fromPropertyDescriptor = function(desc) {
    if (!desc)
        return undef.UNDEFINED;
    return defineProperties(
        compute.bind(
            construct(compute.just(builtin_object.Object), compute.enumeration()),
            function(obj) {
                if (property.isDataDescriptor(desc)) {
                    return defineProperties(compute.just(obj), {
                        'value': property.createValueProperty(
                            compute.just(desc.value),
                            true,
                            true,
                            true),
                        'writable': property.createValueProperty(
                            boolean.create(desc.writable),
                            true,
                            true,
                            true),
                    });
                } else {
                    return defineProperties(compute.just(obj), {
                        'get': {
                            'value': compute.just(desc.get),
                            'enumerable': true,
                            'writable': true,
                            'configurable': true
                        },
                        'set': {
                            'value': compute.just(desc.set),
                            'enumerable': true,
                            'writable': true,
                            'configurable': true
                        },
                    });
                }
            }),
        {
            'enumerable': {
                'value': boolean.create(desc.enumerable),
                'enumerable': true,
                'writable': true,
                'configurable': true
            },
            'configurable': {
                'value': boolean.create(desc.configurable),
                'enumerable': true,
                'writable': true,
                'configurable': true
            }
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
        return compute.branch(hasProperty(obj, prop),
            compute.binds(
                compute.enumeration(
                    f(compute.bind(obj, function(o){ return get(o, prop); })),
                    desc),
                function(x, desc) {
                    return compute.just(amulet_object.defineProperty(desc, prop, {
                        'enumerable': true,
                        'writable': true,
                        'configurable': true,
                        'value': x
                    }));
                }),
            desc);
    };
    
    var isCallable = function(v) {
        return compute.bind(v, function(ref){
            return compute.bind(value_reference.getValue(compute.just(ref)), function (obj) {
                return (value.isCallable(obj) ?
                    compute.just(ref) :
                    error.typeError());
            });
        });
    };
    
    var toBoolean = function(c) {
        return boolean.isTrue(compute.bind(c, type_conversion.toBoolean));
    };
    
    return function(obj) {
        return compute.bind(
            value_reference.getValue(obj),
            function(t) {
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

/* Operations
 ******************************************************************************/
/**
 * 
 */
var construct = function(callee, a) {
    return compute.binds(
        compute.enumeration(
            value_reference.getValue(compute.just(callee))),
        function(obj) {
            return (value.isObject(obj) ?
                obj.construct(callee, new args.Args(a)) :
                error.typeError());
        });
};

/**
 * 
 */
var create = function(proto, properties) {
    return value_reference.create(
        new meta_object.Object(proto, (properties || {})));
};

/**
 * Computation that gets the value of a property on an object.
 * 
 * Returns either the result of the get call or errors with a typeError if
 * no implementation of get exists for `obj`.
 * 
 * @param obj Reference to object.
 * @param {string} name Property name to set.
 */
var get = function(obj, name) {
    return compute.bind(
        value_reference.getValue(compute.just(obj)),
        function(o) {
            if (!value.isObject(o) || !o.get)
                return error.typeError();
            return o.get(obj, name);
        });
};

/**
 * Computation that sets the value of a property on an object.
 * 
 * Returns either the result of the set call or errors with a typeError if
 * no implementation of set exists for `obj`.
 * 
 * @param obj Reference to object.
 * @param {string} name Property name to set.
 * @param val Value to set property to.
 */
var set = function(obj, name, val) {
    return compute.bind(
        value_reference.getValue(compute.just(obj)),
        function(o) {
            if (!value.isObject(o) || !o.set)
                return error.typeError();
            return o.set(obj, name, val);
        });
};

/**
 * Computation of if `v` is an instance of `obj`.
 */
var hasInstance = function(obj, v) {
    return compute.binary(v, obj, function(lref, rref) {
        return compute.bind(value_reference.getValue(compute.just(rref)), function(o) {
            if (!value.isObject(o) || !o.hasInstance)
                return error.typeError();
            return o.hasInstance(rref, lref);
        });
    });
};

/**
 * Computation of if `obj` has a property `name`.
 * 
 * Check includes the object's prototype chain.
 */
var hasProperty = function(obj, name) {
    return compute.bind(obj, function(ref) {
        return compute.bind(
            value_reference.getValue(compute.just(ref)),
            function(o) {
                if (!value.isObject(o) || !o.hasProperty)
                    return error.typeError();
                return o.hasProperty(ref, name);
            });
        });
};

/**
 * Computation of if `obj` has own property `name`.
 * 
 * Only checks obj, not the prototype chain.
 */
var hasOwnProperty = function(obj, name) {
    return compute.bind(obj, function(ref) {
        return compute.bind(
            value_reference.getValue(compute.just(ref)),
            function(o) {
                if (!value.isObject(o) || !o.hasOwnProperty)
                    return error.typeError();
                return compute.just(o.hasOwnProperty(name));
            });
        });
};

/**
 * Computation that gets the host type identifier for `obj`.
 * 
 * Returns a host string that identifies the object's type or errors with a 
 * type error if `obj` is not an object.
 * 
 * @param obj Value.
 */
var typeofObject = function(obj) {
    return compute.bind(
        value_reference.getValue(obj),
        function(val) {
            switch (value.type(val)) {
            case type.BOOLEAN_TYPE:
                return compute.just("boolean");
            case type.NULL_TYPE:
                return compute.just("object");
            case type.NUMBER_TYPE:
                return compute.just("number");
            case type.OBJECT_TYPE:
                return compute.just(value.isCallable(val) ?
                    "function":
                    "object")
            case type.STRING_TYPE:
                return compute.just("string");
            case type.UNDEFINED:
                return compute.just("undefined");
            default:
                return error.typeError();
            }
        });
};

/**
 * 
 */
var defineProperty = function(ref, name, desc) {
    return compute.binds(
        compute.enumeration(
            ref,
            desc.value || compute.empty,
            desc.get || compute.empty,
            desc.set || compute.empty),
        function(objRef, value, get, set) {
            return compute.bind(value_reference.getValue(compute.just(objRef)), function(obj) {
                return obj.defineProperty(objRef, name, {
                    'enumerable': !!desc.enumerable,
                    'configurable': !!desc.configurable,
                    'writable': !!desc.writable,
                    'value': value,
                    'get': get,
                    'set': set
                });
            });
        });
};

/**
 * 
 */
var defineProperties = function(ref, props) {
    return Object.keys(props).reduce(function(p, key) {
        return defineProperty(p, key, props[key]);
    }, ref);
};

/**
 * 
 */
var deleteProperty = function(ref, name) {
    return compute.bind(ref, function(ref) {
        return compute.bind(value_reference.getValue(compute.just(ref)), function(obj) {
            return obj.deleteProperty(ref, name);
        })
    });
};

/* 
 ******************************************************************************/
exports.fromPropertyDescriptor = fromPropertyDescriptor;
exports.toPropertyDescriptor = toPropertyDescriptor;

exports.construct = construct;
exports.create = create;

exports.get = get;
exports.set = set;

exports.hasInstance = hasInstance;
exports.hasProperty = hasProperty;
exports.hasOwnProperty = hasOwnProperty;
exports.typeofObject = typeofObject;

exports.defineProperty = defineProperty;
exports.defineProperties = defineProperties;
exports.deleteProperty = deleteProperty;

});