/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/value/value',
        'atum/value/object', 
        'atum/builtin/builtin_function',
          'atum/semantics/type_conversion',
        'atum/semantics/value_reference',
        'atum/semantics/object',
        'atum/value_reference',
        'atum/value/type',
        'atum/value/string'],
function(compute,
        value,
        object,
        builtin_function,
        type_conversion,
        value_reference_semantics,
        object_semantics,
        value_reference,
        type,
        string){
//"use strict";


/* Object Prototype
 ******************************************************************************/
/**
 * 
 */
var objectPrototypeToString = new builtin_function.BuiltinFunction('toString',
    function(thisObj, args) {
        return compute.bind(
            value_reference_semantics.get(compute.always(thisObj)),
            function(t) {
                switch (value.type(t)) {
                case type.UNDEFINED_TYPE:
                    return compute.always(new string.String("[Object Undefined]"));
                case type.NULL_TYPE:
                    return compute.always(new string.String("[Object Null]"));
                default:
                    return compute.bind(
                        type_conversion.toObject(compute.always(t)),
                        function(o) {
                            return compute.always(new string.String("[Object " + o.Class + "]"));
                        });
                }
            });
});


/**
 * 
 */
var ObjectPrototype = function(props) {
    object.Object.call(this, null, props);
};

ObjectPrototype.prototype = new object.Object();

ObjectPrototype.prototype.Class = "Object";

var ObjectPrototypeRef = new value_reference.ValueReference();

var objectPrototypeCreate = function() {
    return ObjectPrototypeRef.set(
        compute.binda(
            compute.sequence(
                value_reference_semantics.create(compute.always(objectPrototypeToString))),
            function(toString) {
                return compute.always(new ObjectPrototype({
                    'toString': {'value': toString}
                }));
            }));
};

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function() {
    object.Object.call(this, null, {
        'prototype': ObjectPrototypeRef
    });
};

Object.prototype = new object.Object()

Object.prototype.Class = "Object";

/**
 * 
 */
Object.prototype.call = function(thisObj, args) {
    if (args.length < 1) {
        return this.construct([]);
    }
    
    var value = args[0];
    
    switch (value.type(value)) {
    case undefined:
    case type.UNDEFINED_TYPE:
    case type.NULL_TYPE:
        return type_conversion.toObject(value);
    default:
        return this.construct(args);
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
    return object_semantics.create(ObjectPrototypeRef, {});
};

var ObjectRef = new value_reference.ValueReference();

/**
 * 
 */
var create = function() {
    return compute.next(
        objectPrototypeCreate(),
        ObjectRef.set(compute.always(new Object())));
};

/* Export
 ******************************************************************************/
return {
    'Object': Object,
    'ObjectRef': ObjectRef,
    'create': create
};

});