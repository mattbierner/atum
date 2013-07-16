/**
 * @fileOverview The builtin Array object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/func',
        'atum/builtin/meta/object',
        'atum/operations/string',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/object',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_func,
        builtin_object,
        meta_func,
        meta_object,
        string,
        object_operations,
        type_conversion,
        value_reference_operations,
        number,
        object,
        type,
        value){
//"use strict";

/* Refs
 ******************************************************************************/
var arrayRef = new value_reference.ValueReference();

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
        var lenArg = args[0];
        debugger;
        if (value.type(lenArg) === type.NUMBER_TYPE) {
            return compute.bind(
                type_conversion.toUint32(compute.just(lenArg)),
                function(len) {
                    debugger;
                    if (len.value !== lenArg.value)
                        return compute.error("Range");
                    return object_operations.defineProperty(
                        value_reference_operations.create(new ArrayPrototype()),
                        'length', {
                            'value': compute.just(len),
                            'writable': true,
                            'enumerable': true,
                            'configurable': true
                        });
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

/* ArrayPrototype
 ******************************************************************************/
var ArrayPrototype = function(primitiveValue) {
    meta_object.Object.call(this, this.proto, this.properties, primitiveValue);
};
ArrayPrototype.prototype = new meta_object.Object;
ArrayPrototype.prototype.constructor = ArrayPrototype; 

ArrayPrototype.prototype.proto = builtin_object.ObjectPrototype;

ArrayPrototype.prototype.properties = { };


/* Initialization
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        arrayRef.setValue(new Array()),
        arrayPrototypeRef.setValue(new ArrayPrototype()));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Array = arrayRef;
exports.ArrayPrototype = arrayPrototypeRef;

});