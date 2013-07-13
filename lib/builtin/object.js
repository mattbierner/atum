/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/builtin_function',
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

var objectPrototypeRef = new value_reference.ValueReference();
var objectPrototypeValueOfRef = new value_reference.ValueReference();

var toStringRef = new value_reference.ValueReference();

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function() {
    object.Object.call(this, null, this.properties);
};
Object.prototype = new object.Object();

Object.prototype.cls ="Object";

Object.prototype.proto = objectPrototypeRef;

Object.prototype.properties = {
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
    return value_reference_semantics.create(new ObjectPrototype());
};

/**
 * 
 */
var objectCreate = function(_, args) {
    if (args.length < 1)
        return compute.error('');
    
    var o = args[0],
        properties = args[1];
    
    return compute.bind(value_reference.getValue(o), function(t) {
        var type = value.type(t);
        if (type != type.NULL_TYPE || type != type.OBJECT_TYPE)
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
    return compute.bind(thisObj.getValue(), function(t) {
        switch (value.type(t)) {
        case type.UNDEFINED_TYPE:
            return string.create("[Object Undefined]");
        case type.NULL_TYPE:
            return string.create("[Object Null]");
        default:
            return compute.bind(
                type_conversion.toObject(compute.just(t)),
                function(o) {
                    return string.create("[Object " + o.cls + "]");
                });
        }
    });
};

/**
 * 
 */
var ObjectPrototype = function() {
    object.Object.call(this, null, {
        'toString': {
            'value': toStringRef
        },
        'valueOf': {
            'value': objectPrototypeValueOf
        },
        'prototype': {
            'value': objectPrototypeRef
        }
    });
};
ObjectPrototype.prototype = new object.Object;
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

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        objectRef.setValue(new Object()),
        toStringRef.setValue(new builtin_function.BuiltinFunction('toString', objectPrototypeToString)),
        objectPrototypeValueOfRef.setValue(new builtin_function.BuiltinFunction('valueOf', objectPrototypeValueOf)),
        objectPrototypeRef.setValue(new ObjectPrototype()));
};

/* Export
 ******************************************************************************/
exports.Object = Object;
exports.objectRef = objectRef;

exports.objectPrototypeRef = objectPrototypeRef;

exports.initialize = initialize;

});