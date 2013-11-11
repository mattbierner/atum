/**
 * @fileOverview Hosted object operations.
 */
define(['exports',
        'atum/compute',
        'atum/property_reference',
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
    return compute.bind(execution_context.strict, function(strict) {
        return value_reference.dereference(ref, function(obj, ref) {
            if (!value.isObject(obj) || !obj.set)
                return error.typeError(string.create('set on non-object'));
            return obj.set(ref, name + '', val, strict);
        });
    });
};

/**
 * 
 */
var defineProperty = function(ref, name, desc) {
    name = name + '';
    return value_reference.dereferenceFrom(ref, function(obj, objRef) {
        return compute.next(
            (property.isAccessorDescriptor(desc) ?
                 obj.defineProperty(objRef, name, property.createAccessorProperty(
                    desc.get,
                    desc.set,
                    desc.enumerable,
                    desc.configurable)) :
                obj.defineProperty(objRef, name, property.createValueProperty(
                    desc.value,
                    desc.enumerable,
                    desc.writable,
                    desc.configurable))),
            compute.just(objRef));
    });
};

/**
 * 
 */
var defineProperties = function(ref, props) {
    return Object.keys(props).reduce(function(p, key) {
        return compute.next(
            p,
            defineProperty(compute.just(ref), key, props[key]));
    }, compute.just(ref));
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
            return error.typeError(string.create('delete non-object'));
        
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
// Property Operations
exports.hasProperty = hasProperty;
exports.hasOwnProperty = hasOwnProperty;
exports.getEnumerableProperties = getEnumerableProperties;

exports.get = get;
exports.set = set;

exports.defineProperty = defineProperty;
exports.defineProperties = defineProperties;
exports.deleteStrictnessProperty = deleteStrictnessProperty;
exports.deleteProperty = deleteProperty;

// Other Operations
exports.setPrototype = setPrototype;
exports.setExtensibility = setExtensibility;
exports.hasInstance = hasInstance;
exports.typeofObject = typeofObject;

});