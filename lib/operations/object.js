/**
 * 
 */
define(['exports',
        'atum/compute',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/property_reference',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        builtin_object,
        meta_object,
        error,
        property_reference, 
        undef,
        value_reference,
        args,
        type,
        value) {
//"use strict";

/* Operations
 ******************************************************************************/
var construct = function(callee, arg) {
    return compute.binds(
        compute.enumeration(
            callee,
            value_reference.getValue(callee),
            arg),
        function(ref, obj, a) {
            return (value.isObject(obj) ?
                obj.construct(new args.Args(a)) :
                error.typeError());
        });
};

/**
 * 
 */
var create = function(proto, properties) {
    return value_reference.create(
        new meta_object.Object(proto, properties));
};

/**
 * Computation that gets the value of a property on an object.
 * 
 * @param obj Computation of reference to object.
 * @param {string} name Name of property to get value.
 */
var get = function(obj, name) {
    return compute.bind(obj, function(ref){
        return compute.bind(value_reference.getValue(compute.just(ref)), function(o) {
            return (o.get ?
                o.get(ref, name) :
                undef.UNDEFINED);
        });
    });
};

/**
 * Computation that sets the value of a property on an object 
 * 
 * @param obj Computation of reference to object.
 * @param {string} 
 */
var set = function(obj, name, value) {
    return compute.binds(
        compute.enumeration(
            obj,
            value),
        function(ref, x){
            return compute.bind(
                value_reference.getValue(compute.just(ref)), function(o) {
                return (o.set ?
                    o.set(ref, name, x) :
                    undef.UNDEFINED);
            });
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
                return compute.just(o.hasOwnProperty(name.value));
            });
        });
};

/**
 * Computation that gets the host type identifier for `obj`.
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