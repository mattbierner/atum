/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/builtin_function',
        'atum/builtin/object',
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
        builtin_object,
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

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function() {
    object.Object.call(this, null, this.properties);
};
Object.prototype = new object.Object();
Object.prototype.constructor = Object;

Object.prototype.cls ="Object";

/**
 * 
 */
Object.prototype.construct = function(args) {
    if (args.length) {
        return type_conversion.toObject(compute.just(args[0]));
    }
    return value_reference_semantics.create(new builtin_object.ObjectPrototype());
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

/* Object Prototype
 ******************************************************************************/
/**
 * 
 */
var ObjectPrototype = function() {
    object.Object.call(this, this.proto, this.properties);
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


/* Export
 ******************************************************************************/

exports.Object = Object;
exports.ObjectPrototype = ObjectPrototype;

});