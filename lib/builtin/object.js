/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/value/object', 
        'atum/value/boolean', 'atum/value/string', 'atum/value/number',
        'atum/builtin/builtin_function',
        'atum/semantics/value_reference',
        'atum/semantics/object',
        'atum/value_reference'],
function(compute,
        object, boolean, string, number,
        builtin_function,
        value_reference_semantics,
        object_semantics,
        value_reference){
//"use strict";

/* Object Prototype
 ******************************************************************************/
var objectPrototypeToString = new builtin_function.BuiltinFunction('toString',
    function(thisObj, args) {
        
    });

var ObjectPrototypeRef = new value_reference.ValueReference();

/**
 * 
 */
var ObjectPrototype = function() {
    object.Object.call(this, null, {});
};

ObjectPrototype.prototype = new object.Object;

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function() {
    object.Object.call(this, null, {});
};

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

/**
 * 
 */
var create = function() {
    return compute.bind(
        ObjectPrototypeRef.set(object_semantics.create(null, {})),
        function(obj) {
            
            return compute.next(
                ObjectPrototypeRef.set(compute.always(new Object())),
                compute.always(ObjectPrototypeRef));
        });
};

/* Export
 ******************************************************************************/
return {
    'Object': Object,
    
    'create': create
};

});