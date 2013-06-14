/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/value/value',
        'atum/value/object', 
        'atum/builtin/builtin_function',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/operations/object',
        'atum/operations/undef',
        'atum/value_reference',
        'atum/value/type',
        'atum/operations/string'],
function(compute,
        value,
        object,
        builtin_function,
        type_conversion,
        value_reference_semantics,
        object_semantics,
        undef,
        value_reference,
        type,
        string){
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
    if (args.length >= 1) {
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
var objectPrototypeToString = new builtin_function.BuiltinFunction('toString',
    function(thisObj, args) {
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
});

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
Object.prototype.call = function(thisObj, args) {
    if (args.length < 1) {
        return this.construct([]);
    }
    
    var value = args[0];
    
    switch (value.type(value)) {
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return type_conversion.toObject(value);
    default:
        return this.construct(args);
    }
};

/*
var objectCreate = new builtin_function.BuiltinFunction('create',
    function(thisObj, args) {
        return compute.bind(
            value_reference_semantics.getValue(compute.always(thisObj)),
            function(t) {
                switch (value.type(t)) {
                case type.OBJECT_TYPE:
                case type.NULL_TYPE:
                    var obj = Object.prototype.construct
                    return compute.always(new string.String("[Object Null]"));
                default:
                    return compute.error();
                }
            });
});*/
/*
var create = function(proto, properties) {
    return value_reference.create(
        compute.always(object.create(proto, properties)));
};*/

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        objectRef.setValue(new Object()),
        toStringRef.setValue(objectPrototypeToString),
        objectPrototypeRef.setValue(new ObjectPrototype()));
};

/* Export
 ******************************************************************************/
return {
    'Object': Object,
    'objectRef': objectRef,
    
    'initialize': initialize
};

});