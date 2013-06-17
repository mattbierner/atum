/**
 * @fileOverview
 */
define(['require',
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
function(require,
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

var toStringRef = new value_reference.ValueReference();

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function() {
    //object.Object.call(this, this.proto);
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
        var value = args[0];
        switch (value.type(value)) {
        case type.OBJECT_TYPE:
            return compute.always(value);
        case type.STRING_TYPE:
        case type.BOOLEAN_TYPE:
        case type.NUMBER_TYPE:
            return type_conversion.toObject(value);
        }
    }
    return value_reference_semantics.create(new ObjectPrototype());
};

/* Object Prototype
 ******************************************************************************/
/**
 * 
 */
var objectPrototypeToString = function(thisObj, args) {
    return compute.bind(thisObj.getValue(), function(t) {
        switch (value.type(t)) {
        case type.UNDEFINED_TYPE:
            return string.create("[Object Undefined]");
        case type.NULL_TYPE:
            return string.create("[Object Null]");
        default:
            return compute.bind(
                type_conversion.toObject(compute.always(t)),
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
    Object.call(this, null, {
        'toString': {
            'value': toStringRef
        },
        'prototype': {
            'value': objectPrototypeRef
        }
    });
};

ObjectPrototype.prototype = new object.Object;
ObjectPrototype.prototype.constructor = ObjectPrototype;

ObjectPrototype.prototype.cls = "Object";

/**
 * The default value of an object.
 */
Object.prototype.defaultValue = function(hint) { 
    var that = this;
    return compute.bind(value_reference.getValue(that.get("toString")), function(toString) {
        if (toString && value.isCallable(toString)) {
            return toString.call(that, []);
        }
        return compute.bind(value_reference.getValue(that.get("valueOf")), function(toString) {
            return valueOf.call(that, []);
        });
    });
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
        return type_conversion.toObject(compute.always(val));
    }
};

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        objectRef.setValue(new Object()),
        toStringRef.setValue(new builtin_function.BuiltinFunction('toString', objectPrototypeToString)),
        objectPrototypeRef.setValue(new ObjectPrototype()));
};

/* Export
 ******************************************************************************/
return {
    'Object': Object,
    'objectRef': objectRef,
    'objectPrototypeRef': objectPrototypeRef,
    
    'initialize': initialize
};

});