/**
 * @fileOverview Builtin Array object.
 */
define(['exports',
        'bes/record',
        'atum/compute',
        'atum/builtin/array',
        'atum/builtin/object',
        'atum/builtin/meta/array',
        'atum/builtin/meta/object',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/boolean',
        'atum/operations/construct',
        'atum/operations/evaluation',
        'atum/operations/string',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/compare',
        'atum/value/type_conversion',
        'atum/value/property',
        'atum/value/value',
        'text!atum/builtin/hosted/array.js'],
function(exports,
        record,
        compute,
        array_builtin,
        object_builtin,
        meta_array,
        meta_object,
        array_op,
        builtin_constructor,
        builtin_function,
        boolean,
        construct,
        evaluation,
        string,
        object,
        value_reference,
        value_compare,
        value_type_conversion,
        property,
        value){
'use strict';

/* Array
 ******************************************************************************/
var Array = {
    'call': function(ref, thisObj, args) {
        return construct.constructForward(ref, args);
    },
    
    'construct': function(ref, args) {
        if (args.length === 1) {
            var lenArg = args.getArg(0);
            if (value.isNumber(lenArg)) {
                var len = value_type_conversion.toUint32(lenArg);
                if (!value_compare.strictEqual(len, lenArg))
                    return error.rangeError();
                
                return compute.bind(
                    value_reference.create(new ArrayInstance()),
                    function(t) {
                        return object.defineProperty(t, 'length',
                            property.createValuePropertyFlags(
                                len,
                                property.WRITABLE));
                    });
            }
        }
        
        return array_op.create(args.args);
    },
    
    'properties': {
        'isArray': property.createValuePropertyFlags(
            array_builtin.ArrayIsArray,
            property.WRITABLE | property.CONFIGURABLE),
        
        'prototype': property.createValuePropertyFlags(
            array_builtin.ArrayPrototype)
    }
};

/**
 * `Array.isArray(arg)`
 * 
 * Is `arg` an array object.
 */
var arrayIsArray = function(ref, thisObj, args) {
    return value_reference.dereference(
        args.getArg(0),
        function(arg) {
            return boolean.create(value.isObject(arg) && arg instanceof meta_array.Array);
        });
};

/* ArrayInstance
 ******************************************************************************/
var ArrayInstance = record.extend(meta_array.Array,
    [],
    function() {
        meta_array.Array.call(this, this.proto, this.properties, true);
    });

ArrayInstance.prototype.proto = array_builtin.ArrayPrototype;

ArrayInstance.prototype.properties = {};

/* ArrayPrototype
 ******************************************************************************/
/**
 * `Array.prototype`
 */
var ArrayPrototype = new meta_object.Object(
    object_builtin.ObjectPrototype, {
        'constructor': property.createValuePropertyFlags(array_builtin.Array,
            property.WRITABLE | property.CONFIGURABLE)
    },
    true);

/* Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        builtin_constructor.create(array_builtin.Array, 'Array', 1, Array.properties, Array.call, Array.construct),
        
        builtin_function.create(array_builtin.ArrayIsArray, 'isArray', 1, arrayIsArray),
        
        array_builtin.ArrayPrototype.setValue(ArrayPrototype));
};

var configure = function(mutableBinding, immutableBinding) {
    return compute.sequence(
        mutableBinding('Array', array_builtin.Array));
};

var execute = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/array.js');
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;
exports.configure = configure;
exports.execute = execute;

});