/**
 * @fileOverview Hosted object operations.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/property_reference',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/string',
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
        property_reference,
        object_builtin,
        meta_object,
        boolean,
        error,
        func,
        string,
        type_conversion,
        undef,
        value_reference,
        args,
        property,
        type,
        value) {
"use strict";

/* Descriptor Operations
 ******************************************************************************/
var fromPropertyDescriptor = function(desc) {
    if (!desc)
        return undef.UNDEFINED;
    return defineProperties(
        compute.bind(
            construct(object_builtin.Object, []),
            function(obj) {
                if (property.isDataDescriptor(desc)) {
                    return defineProperties(compute.just(obj), {
                        'value': property.createValuePropertyFlags(
                            compute.just(desc.value),
                            property.ENUMERABLE | property.CONFIGURABLE | property.WRITABLE),
                        'writable': property.createValuePropertyFlags(
                            boolean.create(desc.writable),
                            property.ENUMERABLE | property.CONFIGURABLE | property.WRITABLE),
                    });
                } else {
                    return defineProperties(compute.just(obj), {
                        'get': {
                            'value': desc.get,
                            'enumerable': true,
                            'writable': true,
                            'configurable': true
                        },
                        'set': {
                            'value':desc.set,
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
        return compute.bind(obj, function(o) {
            return compute.branch(hasProperty(o, prop),
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

/* Creation Operations
 ******************************************************************************/
/**
 * Construct a new object from a constructor.
 * 
 * @param callee Reference the constructor object.
 * @param a Array of arguments to pass to constructor.
 */
var construct = function(callee, a) {
    return value_reference.dereference(callee, function(obj) {
        return (value.isObject(obj) ?
            obj.construct(callee, new args.Args(a)) :
            error.typeError(string.create('construct on non object')));
    });
};

/**
 * 
 */
var create = function(proto, properties) {
    return value_reference.create(
        new meta_object.Object(proto, properties));
};

/* Property Operations
 ******************************************************************************/
/**
 * Does an object have a property.
 * 
 * Check includes the object's prototype chain.
 * 
 * @param ref Reference to object.
 * @param {String} name Name of property to check for.
 */
var hasProperty = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val) || !val.hasProperty)
            return error.typeError(string.create('hasProperty on non-object'));
        return val.hasProperty(ref, name);
    });
};

/**
 * Does an object have its own property.
 * 
 * Only checks obj, not the prototype chain.
 * 
 * @param ref Reference to object.
 * @param {String} name Name of property to check for.
 */
var hasOwnProperty = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val) || !val.hasOwnProperty)
            return error.typeError(string.create('hasOwnProperty on non-object'));
        return compute.just(val.hasOwnProperty(name));
    });
};

/**
 * Get a host array of all enumerable properties of an object
 * 
 * @param ref Reference to object.
 */
var getEnumerableProperties = function(ref) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val) || !val.getEnumerableProperties)
            return error.typeError(string.create('getEnumerableProperties on non-object'));
        return compute.just(val.getEnumerableProperties());
    });
};

/**
 * Gets the value of a property on an object.
 * 
 * Returns either the result of the get call or errors with a typeError if
 * no implementation of get exists for `obj`.
 * 
 * @param ref Reference to object.
 * @param {string} name Property name to get.
 */
var get = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val) || !val.get)
            return error.typeError(string.create('get on non-object'));
        return val.get(ref, name + '');
    });
};

/**
 * Set the value of a property on an object.
 * 
 * Returns either the result of the set call or errors with a typeError if
 * no implementation of set exists for `obj`.
 * 
 * @param ref Reference to object.
 * @param {string} name Property name to set.
 * @param val New value for property.
 */
var set = function(ref, name, val) {
    return value_reference.dereference(ref, function(obj, ref) {
        if (!value.isObject(obj) || !obj.set)
            return error.typeError(string.create('set on non-object'));
        return obj.set(ref, name + '', val);
    });
};

/**
 * 
 */
var defineProperty = function(ref, name, desc) {
    name = name + '';
    return value_reference.dereferenceFrom(ref, function(obj, objRef) {
        if (property.isAccessorDescriptor(desc)) {
            return obj.defineProperty(objRef, name, property.createAccessorProperty(
                desc.get || null,
                desc.set || null,
                desc.enumerable,
                desc.configurable));
        } else {
            return obj.defineProperty(objRef, name, property.createValueProperty(
                desc.value,
                desc.enumerable,
                desc.writable,
                desc.configurable));
        }
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
 * Delete a property on an object.
 * 
 * @param ref Reference to object to delete the property on.
 * @param {String} name Name of the property to delete.
 */
var deleteProperty = function(ref, name) {
    return value_reference.dereference(ref, function(obj, ref) {
        if (!value.isObject(obj))
            return error.typeError(string.create('delete non-object'));
        return obj.deleteProperty(ref, name + '');
    });
};

/* Other Operations
 ******************************************************************************/
/**
 * Set the internal prototype of an object.
 * 
 * @param ref Reference to object.
 * @param proto New prototype.
 */
var setPrototype = function(ref, proto) {
    return value_reference.modifyValue(ref, function(val) {
        return val.setPrototype(proto);
    });
};

/**
 * Is an `other` an instance of `ref`.
 * 
 * @param ref Reference to object to check against.
 * @param other Reference to instance.
 */
var hasInstance = function(ref, other) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val) || !val.hasInstance)
            return error.typeError(string.create('hasInstance on non-object'));
        return val.hasInstance(ref, other);
    });
};

/**
 * Get the type identifier for a value.
 * 
 * Returns a host string that identifies the value's type or errors with a 
 * type error if the type cannot be determined.
 * 
 * @param obj Value.
 */
var typeofObject = function(obj) {
    return compute.bind(
        value_reference.getFrom(obj),
        function(val) {
            switch (value.type(val)) {
            case type.BOOLEAN:     return compute.just("boolean");
            case type.NULL:        return compute.just("object");
            case type.NUMBER:      return compute.just("number");
            case type.OBJECT:      return compute.just(value.isCallable(val) ? "function" : "object");
            case type.STRING:      return compute.just("string");
            case type.UNDEFINED:   return compute.just("undefined");
            default: return error.typeError(string.create('cannot get typeof value'));
            }
        });
};

/* Exports
 ******************************************************************************/
// Descriptor Operations
exports.fromPropertyDescriptor = fromPropertyDescriptor;
exports.toPropertyDescriptor = toPropertyDescriptor;

// Creation Operations
exports.construct = construct;
exports.create = create;

// Property Operations
exports.hasProperty = hasProperty;
exports.hasOwnProperty = hasOwnProperty;
exports.getEnumerableProperties = getEnumerableProperties;

exports.get = get;
exports.set = set;

exports.defineProperty = defineProperty;
exports.defineProperties = defineProperties;
exports.deleteProperty = deleteProperty;

// Other Operations
exports.setPrototype = setPrototype;
exports.hasInstance = hasInstance;
exports.typeofObject = typeofObject;

});