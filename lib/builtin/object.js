/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/builtin_function',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/object', 
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_function,
        meta_func,
        meta_object,
        func,
        object_semantics,
        string,
        type_conversion,
        undef,
        value_reference_semantics,
        object,
        type,
        value){
//"use strict";

/* Refs
 ******************************************************************************/
var objectRef = new value_reference.ValueReference();
var objectCreateRef = new value_reference.ValueReference();

var objectPrototypeRef = new value_reference.ValueReference();
var objectPrototypeValueOfRef = new value_reference.ValueReference();
var toStringRef = new value_reference.ValueReference();

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function() {
    meta_func.Function.call(this, this.proto, this.properties);
};
Object.prototype = new meta_func.Function;

Object.prototype.proto = objectPrototypeRef;

Object.prototype.properties = {
    'create': {
        'value': objectCreateRef
    },
    'prototype': {
        'value': objectPrototypeRef
    }
};

/**
 * 
 */
Object.prototype.construct = function(args) {
    if (args.length) {
        return type_conversion.toObject(compute.just(args[0]));
    }
    return value_reference_semantics.create(new ObjectPrototype(objectPrototypeRef));
};

/**
 * 
 */
Object.prototype.call = function(ref, thisObj, args) {
    if (args.length < 1) {
        return this.construct([]);
    }
    
    var val = args[0];
    
    switch (value.type(val)) {
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return this.construct(args);
    default:
        return type_conversion.toObject(compute.just(val));
    }
};

/**
 * `Object.create`
 */
var objectCreate = function(ref, _, args) {
    if (args.length < 1)
        return compute.error('');
    
    var o = args[0],
        properties = args[1];
    
    return compute.bind(value_reference_semantics.getValue(compute.just(o)), function(t) {
        if (!(value.type(t) === type.NULL_TYPE || value.type(t) === type.OBJECT_TYPE))
            return compute.error('');
        return compute.bind(Object.prototype.construct([]), function(obj) {
            return (properties ?
                objectDefineProperties(obj, [properties]) :
                compute.just(obj));
        });
    });
};

/**
 * 
 */
var objectDefineProperties = function(_, args) {
};

/**
 * 
 */
var objectDefineProperty = function(_, args) {
};



/* Object Prototype
 ******************************************************************************/
/**
 * 
 */
var objectPrototypeToString = function(ref, thisObj, args) {
    return compute.bind(value_reference_semantics.getValue(compute.just(thisObj)), function(t) {
        switch (value.type(t)) {
        case type.UNDEFINED_TYPE:
            return string.create("[object Undefined]");
        case type.NULL_TYPE:
            return string.create("[object Null]");
        default:
            return compute.bind(
                value_reference_semantics.getValue(type_conversion.toObject(compute.just(t))),
                function(o) {
                    return string.create("[object " + o.cls + "]");
                });
        }
    });
};

/**
 * 
 */
var ObjectPrototype = function() {
    this.proto = null;
    this.properties = {
        'toString': {
            'value': toStringRef
        },
        'valueOf': {
            'value': objectPrototypeValueOf
        },
        'prototype': {
            'value': objectPrototypeRef
        }
    };
    meta_object.Object.call(this);
};
ObjectPrototype.prototype = new meta_object.Object;
ObjectPrototype.prototype.constructor = ObjectPrototype;
ObjectPrototype.prototype.cls = "Object";

ObjectPrototype.prototype.defaultValue = function(ref, hint) {
    var thisToString = this.get(ref, "toString"),
        thisValueOf = this.get(ref, "valueOf");
    
    var toString = value_reference_semantics.getValue(thisToString),
        valueOf = value_reference_semantics.getValue(thisValueOf);
    
    switch (hint)
    {
    case 'String':
        return compute.bind(toString, function(toStringImpl) {
            if (toStringImpl && value.isCallable(toStringImpl)) {
                return toStringImpl.call(thisToString, ref, []);
            }
            return compute.bind(valueOf, function(valueOfImpl) {
                return valueOf.call(thisValueOf, ref, []);
            });
        });
    case 'Number':
    default:
         return compute.bind(valueOf, function(valueOfImpl) {
            if (valueOfImpl && value.isCallable(valueOfImpl)) {
                return valueOfImpl.call(thisValueOf, ref, []);
            }
            return compute.bind(toString, function(toStringImpl) {
                return toStringImpl.call(thisToString, ref, []);
            });
        });
    }
};

var objectPrototypeValueOf = function(ref, thisObj, args) {
    return compute.just(thisObj);
};


/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        objectRef.setValue(new Object()),
        objectCreateRef.setValue(builtin_function.create('create', 2, objectCreate)),
        toStringRef.setValue(builtin_function.create('toString', 0, objectPrototypeToString)),
        objectPrototypeValueOfRef.setValue(builtin_function.create('valueOf', 0, objectPrototypeValueOf)),
        objectPrototypeRef.setValue(new ObjectPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Object = objectRef;
exports.ObjectPrototype = objectPrototypeRef;

});