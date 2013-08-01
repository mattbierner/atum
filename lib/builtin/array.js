/**
 * @fileOverview The builtin Array object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/array',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/operations/boolean',
        'atum/operations/string',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/object',
        'atum/value/type',
        'atum/value/type_conversion',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_func,
        builtin_object,
        meta_array,
        meta_func,
        meta_object,
        boolean,
        string,
        object_operations,
        type_conversion,
        value_reference_operations,
        number,
        object,
        type,
        value_type_conversion,
        value){
//"use strict";

/* Refs
 ******************************************************************************/
var arrayRef = new value_reference.ValueReference();
var arrayIsArrayRef = new value_reference.ValueReference();

var arrayPrototypeRef = new value_reference.ValueReference();

/* Array
 ******************************************************************************/
/**
 * Hosted `Array` constructor.
 */
var Array = function() {
    meta_func.Function.call(this, this.proto, this.properties);
};
Array.prototype = new meta_func.Function;
Array.prototype.constructor = Array;

Array.prototype.proto = builtin_func.FunctionPrototype;

Array.prototype.properties = {
    'prototype': {
        'value': arrayPrototypeRef
    },
    'isArray': {
        'value': arrayIsArrayRef
    }
};

/**
 * 
 */
Array.prototype.call = function(ref, thisObj, args) {
    return this.construct(args);
};

/**
 * Builtin Array constructor.
 */
Array.prototype.construct = function(args) {
    if (args.length === 1) {
        var lenArg = args.getArg(0);
        if (value.type(lenArg) === type.NUMBER_TYPE) {
            var len = value_type_conversion.toUint32(lenArg);
            if (len.value !== lenArg.value)
                return compute.error("Range");
            return object_operations.defineProperty(
                value_reference_operations.create(new ArrayPrototype()),
                'length', {
                    'value': compute.just(len),
                    'writable': true,
                    'enumerable': false,
                    'configurable': false
                });
        }
    }
    
    return args.reduce(function(p, c, i) {
        return object_operations.defineProperty(
            p,
            i + "", {
                'value': compute.just(c),
                'writable': true,
                'enumerable': true,
                'configurable': true
            });
    }, this.construct([new number.Number(args.length)]));
};

/**
 * `Array.isArray`
 */
var arrayIsArray = function(ref, _, args) {
    if (args.length === 0)
        return boolean.create(false);
    
    return compute.bind(
        value_reference.getValue(args.getArg(0)),
        function(arg) {
            return boolean.create(arg.cls === ArrayPrototype.prototype.cls);
        });
};

/* ArrayPrototype
 ******************************************************************************/
var ArrayPrototype = function() {
    meta_array.Array.call(this, this.proto, this.properties);
};
ArrayPrototype.prototype = new meta_array.Array;
ArrayPrototype.prototype.constructor = ArrayPrototype; 

ArrayPrototype.prototype.proto = builtin_object.ObjectPrototype;

ArrayPrototype.prototype.properties = {
    'constructor': {
        'value': arrayRef
    }
};


/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        arrayRef.setValue(new Array()),
        arrayIsArrayRef.setValue(compute.just("")),
        arrayPrototypeRef.setValue(new ArrayPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Array = arrayRef;
exports.ArrayPrototype = arrayPrototypeRef;

});