/**
 * @fileOverview Hosted object operations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/context/property_reference',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/string',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/property',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        property_reference,
        error,
        execution_context,
        string,
        undef,
        value_reference,
        property,
        type,
        value) {
"use strict";

/* Property Operations
 ******************************************************************************/
/**
 * Does an object have a property?
 * 
 * Check includes the object's prototype chain.
 * 
 * @param ref Reference to object.
 * @param {String} name Name of property to check for.
 */
var hasProperty = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val))
            return error.typeError('hasProperty on non-object');
        return val.hasProperty(ref, name);
    });
};

/**
 * Does an object have an own property?
 * 
 * Only checks obj, not the prototype chain.
 * 
 * @param ref Reference to object.
 * @param {String} name Name of property to check for.
 */
var hasOwnProperty = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val))
            return error.typeError('hasOwnProperty on non-object');
        return compute.just(val.hasOwnProperty(name));
    });
};

/**
 * Get the own property of an object.
 * 
 * Only checks obj, not the prototype chain.
 * 
 * @param ref Reference to object.
 * @param {String} name Name of property to check for.
 */
var getOwnProperty = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val) || !val.hasOwnProperty)
            return error.typeError('getOwnProperty on non-object');
        return compute.just(val.getOwnProperty(name));
    });
};

/**
 * Get the property of an object.
 * 
 * @param ref Reference to object.
 * @param {String} name Name of property to check for.
 */
var getProperty = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val) || !val.getProperty)
            return error.typeError('getProperty on non-object');
        return val.getProperty(ref, name);
    });
};

/**
 * Get a host array of all properties of an object.
 * 
 * @param ref Reference to object.
 */
var getOwnPropertyNames = function(ref) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val))
            return error.typeError('getOwnPropertyNames on non-object');
        return compute.just(val.getOwnPropertyNames(ref));
    });
};

/**
 * Get a host array of all enumerable properties of an object
 * 
 * @param ref Reference to object.
 */
var getEnumerableProperties = function(ref) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val))
            return error.typeError('getEnumerableProperties on non-object');
        
        return compute.just(val.getEnumerableProperties());
    });
};

/**
 * Gets the value of a property on an object.
 * 
 * Errors if not called on an object.
 * 
 * @param ref Reference to object.
 * @param {string} name Property name.
 */
var get = function(ref, name) {
    return value_reference.dereference(ref, function(val, ref) {
        if (!value.isObject(val))
            return error.typeError('get on non-object');
        
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
    return compute.bind(execution_context.strict, function(strict) {
        return value_reference.dereference(ref, function(obj, ref) {
            if (!value.isObject(obj) || !obj.set)
                return error.typeError('set on non-object');
            
            return obj.set(ref, name + '', val, strict);
        });
    });
};

/**
 * Define a property on an object.
 * 
 * @param ref Reference to object.
 * @param {string} name Property name.
 * @param desc New property descriptor.
 * @param strict Should an error be thrown if define fails.
 */
var defineProperty = function(ref, name, desc, strict) {
    return compute.next(
        value_reference.dereference(ref, function(obj, objRef) {
            return obj.defineProperty(objRef, name + '', desc, strict);
        }),
        compute.just(ref));
};

/**
 * Define multiple properties on an object.
 * 
 * @param ref Reference to object.
 * @param props Object map of names to property descriptors
 */
var defineProperties = function(ref, props) {
    return compute.mapm_(
        function(key) {
            return defineProperty(ref, key, props[key]);
        }, Object.keys(props));
};

/**
 * Delete a property on an object.
 * 
 * @param ref Reference to object to delete the property on.
 * @param {boolean} strict Should errors be thrown if the delete cannot
 *    be performed.
 * @param {String} name Name of the property to delete.
 */
var deleteStrictnessProperty = function(ref, strict, name) {
    return value_reference.dereference(ref, function(obj, ref) {
        if (!value.isObject(obj))
            return error.typeError('delete non-object');
        
        return obj.deleteProperty(ref, name + '', strict);
    });
};


/**
 * Delete a property using the current environment's strictness.
 */
var deleteProperty = function(ref, name) {
    return compute.bind(
        execution_context.strict,
        function(strict) {
            return deleteStrictnessProperty(ref, strict, name);
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
        return val.setProto(proto);
    });
};

/**
 * Is an object extensible..
 * 
 * @param ref Reference to target object.
 */
var isExtensible = function(ref) {
    return value_reference.dereference(ref, function(t) {
        return compute.bool(t.extensible);
    });
};

/**
 * Set the extensibility of an object.
 * 
 * @param ref Reference to target object.
 * @param {boolean} extensible 
 */
var setExtensibility = function(ref, extensible) {
    return value_reference.modifyValue(ref, function(t) {
        return t.setExtensible(extensible);
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
            return error.typeError('hasInstance on non-object');
        return val.hasInstance(ref, other);
    });
};

/**
 * Get the type identifier for a value.
 * 
 * Returns a host string that identifies the value's type or errors with a 
 * type error if the type cannot be determined.
 * 
 * @param ref Reference to object to check against.
 */
var typeofObject = function(obj) {
    return value_reference.dereference(obj, function(val) {
        switch (val.type) {
        case type.BOOLEAN:     return compute.just("boolean");
        case type.NULL:        return compute.just("object");
        case type.NUMBER:      return compute.just("number");
        case type.OBJECT:      return compute.just(value.isCallable(val) ? "function" : "object");
        case type.STRING:      return compute.just("string");
        case type.UNDEFINED:   return compute.just("undefined");
        }
        return error.typeError('cannot get typeof value');
    });
};

/* Exports
 ******************************************************************************/
// Property Operations
exports.hasProperty = hasProperty;
exports.hasOwnProperty = hasOwnProperty;
exports.getProperty = getProperty;
exports.getOwnProperty = getOwnProperty;
exports.getOwnPropertyNames = getOwnPropertyNames;
exports.getEnumerableProperties = getEnumerableProperties;

exports.get = get;
exports.set = set;

exports.defineProperty = defineProperty;
exports.defineProperties = defineProperties;
exports.deleteStrictnessProperty = deleteStrictnessProperty;
exports.deleteProperty = deleteProperty;

// Other Operations
exports.setPrototype = setPrototype;

exports.isExtensible = isExtensible;
exports.setExtensibility = setExtensibility;

exports.hasInstance = hasInstance;
exports.typeofObject = typeofObject;

});