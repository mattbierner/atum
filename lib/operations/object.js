/**
 * 
 */
define(['exports',
        'atum/compute',
        'atum/internal_reference',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/internal_reference',
        'atum/operations/string',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        internal_reference,
        builtin_object,
        meta_object,
        error,
        internal_reference_semantics,
        string,
        undef,
        value_reference,
        args,
        type,
        value) {
//"use strict";

/* Property Reference
 ******************************************************************************/
/**
 * Language level reference to a property stored in a base object.
 */
var PropertyReference = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
    
    this.isUnresolvable = (base === undefined);

    if (!this.isUnresolvable) {
        switch (value.type(base))
        {
        case type.BOOLEAN_TYPE:
        case type.STRING_TYPE:
        case type.NUMBER_TYPE:
            this.hasPrimitiveBase = true;
            break;
        default:
            this.hasPrimitiveBase = false;
            break;
        }
        this.isProperty = (value.isObject(base) || this.hasPrimitiveBase);
    } else {
        this.isProperty =  false;
        this.hasPrimitiveBase = false;
    }
};
PropertyReference.prototype = new internal_reference.InternalReference;

PropertyReference.prototype.getValue = function() {
    return get(this.getBase(), this.name);
};

PropertyReference.prototype.setValue = function(value) {
    var name = this.name;
    return compute.next(
        compute.bind(this.getBase(), function(base) {
            return compute.bind(value_reference.getValue(compute.just(base)), function(baseObj) {
                return baseObj.set(base, name, value);
            });
        }),
        compute.just(this));
};

PropertyReference.prototype.getBase = function(value) {
    return (this.isUnresolvable ?
        error.referenceError(string.create(this.name)) :
        internal_reference_semantics.getValue(compute.just(this.base)));
};

/* 
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
        compute.just(new meta_object.Object(proto, properties)));
};

/**
 * Computation that gets the value of property `name` from `object`.
 */
var get = function(obj, name) {
    return compute.bind(obj, function(ref){
        return compute.bind(value_reference.getValue(compute.just(ref)), function(o) {
            return (o.get ?
                o.get(ref, name) :
                undef.create());
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
    return compute.bind(ref, function(objRef) {
        return compute.binds(
            compute.enumeration(
                desc.value || compute.empty,
                desc.get || compute.empty,
                desc.set || compute.empty),
            function(value, get, set) {
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
        });
};

var defineProperties = function(ref, props) {
    return Object.keys(props).reduce(function(p, key) {
        return defineProperty(p, key, props[key]);
    }, ref);
};

/* 
 ******************************************************************************/
exports.PropertyReference = PropertyReference;

exports.construct = construct;
exports.create = create;
exports.get = get;
exports.hasInstance = hasInstance;
exports.hasProperty = hasProperty;
exports.typeofObject = typeofObject;

exports.defineProperty = defineProperty;
exports.defineProperties = defineProperties;

});