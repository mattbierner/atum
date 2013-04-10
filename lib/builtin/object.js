/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/value/value',
        'atum/value/object', 
        'atum/value/boolean', 'atum/value/string', 'atum/value/number',
        'atum/value/undef', 'atum/value/nil',
        'atum/builtin/builtin_function',
          'atum/semantics/type_conversion',
        'atum/semantics/value_reference',
        'atum/semantics/object',
        'atum/value_reference'],
function(compute,
        value,
        object, boolean, string, number, undef, nil,
        builtin_function,
        type_conversion,
        value_reference_semantics,
        object_semantics,
        value_reference){
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
                case undef.UNDEFINED_TYPE:
                    return compute.always(new string.String("[Object Undefined]"));
                case nil.NULL_TYPE:
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
    object.Object.call(this, null, {});
};

Object.prototype = new object.Object()

Object.prototype.Class = "Object";


/**
 * 
 */
Object.prototype.construct = function(args) {
    if (args.length >= 1) {
        var value = args[0];
        switch (value.type(value)) {
        case object.OBJECT_TYPE:
            return compute.always(value);
        case string.STRING_TYPE:
        case boolean.BOOLEAN_TYPE:
        case number.NUMBER_TYPE:
            return type_conversion.toObject(value);
        }
    }
    return object_semantics.create(new ObjectPrototype(), {});
};

var ObjectRef = new value_reference.ValueReference();

/**
 * 
 */
var create = function() {
    return compute.bind(
        ObjectRef.set(object_semantics.create(null, {})),
        function(obj) {
            return compute.next(
                objectPrototypeCreate(),
                object_semantics.create(null, {
                    'prototype': {
                        'value': ObjectPrototypeRef
                    }
                }));
        });
};

/* Export
 ******************************************************************************/
return {
    'Object': Object,
    
    'create': create
};

});