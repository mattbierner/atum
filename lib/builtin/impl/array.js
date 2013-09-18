/**
 * @fileOverview The builtin Array object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/array',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/array',
        'atum/builtin/meta/builtin_constructor',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/operations/boolean',
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/number',
        'atum/operations/string',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/type_conversion',
        'atum/value/number',
        'atum/value/property',
        'atum/value/value',
        'text!atum/builtin/hosted/array.js'],
function(exports,
        compute,
        array_ref,
        builtin_func,
        builtin_object,
        meta_array,
        meta_builtin_constructor,
        meta_func,
        meta_object,
        boolean,
        evaluation,
        func,
        number,
        string,
        object,
        type_conversion,
        value_reference,
        value_type_conversion,
        value_number,
        property,
        value){
//"use strict";

/* Array
 ******************************************************************************/
/**
 * `Array(...)`
 */
var ArrayCall = function(ref, thisObj, args) {
    return this.construct(ref, args);
};

/**
 * `new Array(...)`.
 */
ArrayConstruct = function(ref, args) {
    if (args.length === 1) {
        var lenArg = args.getArg(0);
        if (value.isNumber(lenArg)) {
            var len = value_type_conversion.toUint32(lenArg);
            if (len.value !== lenArg.value)
                return error.rangeError();
            
            return object.defineProperty(
                value_reference.create(new ArrayInstance()),
                'length',
                property.createValueProperty(
                    compute.just(len),
                    false,
                    true,
                    false));
        }
    }
    
    return args.reduce(function(p, c, i) {
        return object.defineProperty(
            p,
            i,
            property.createValueProperty(
                compute.just(c),
                true,
                true,
                true));
    }, object.construct(array_ref.Array, [new value_number.Number(args.length)]));
};

/**
 * `Array`
 */
var Array = new meta_builtin_constructor.BuiltinConstructor(
    builtin_func.FunctionPrototype, {
        'isArray': {
            'value': array_ref.ArrayIsArray
        }
    },
    ArrayCall,
    ArrayConstruct);

/**
 * `Array.isArray(arg)`
 * 
 * Is `arg` an array object.
 */
var arrayIsArray = function(ref, thisObj, args) {
    if (args.length === 0)
        return boolean.FALSE;
    
    var arg = args.getArg(0);
    return compute.bind(
        value_reference.getValue(arg),
        function(arg) {
            return boolean.create(arg.cls === ArrayInstance.prototype.cls);
        });
};

/* ArrayInstance
 ******************************************************************************/
var ArrayInstance = function() {
    meta_array.Array.call(this, this.proto, this.properties);
};
ArrayInstance.prototype = new meta_array.Array;
ArrayInstance.prototype.constructor = ArrayInstance; 

ArrayInstance.prototype.proto = array_ref.ArrayPrototype;

ArrayInstance.prototype.properties = {};

/* ArrayPrototype
 ******************************************************************************/
/**
 * `Array.prototype`
 */
var ArrayPrototype = new meta_object.Object(builtin_object.ObjectPrototype, {
    'constructor': {
        'value': array_ref.Array
    }
});

/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');

    return compute.sequence(
        func.createConstructor('Array', 1, array_ref.ArrayPrototype, array_ref.Array.setValue(Array)),

        builtin_function.create(array_ref.ArrayIsArray, 'isArray', 1, arrayIsArray),
        
        array_ref.ArrayPrototype.setValue(ArrayPrototype),
        evaluation.evaluateFile('atum/builtin/hosted/array.js'));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Array = array_ref.Array;
exports.ArrayPrototype = array_ref.ArrayPrototype;

});