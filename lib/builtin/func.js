/**
 * @fileOverview Hosted language function builtins.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/meta/func',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/value',
        'atum/value/object',
        'atum/value/number'],
function(exports,
        compute,
        value_reference,
        meta_func,
        value_reference_semantics,
        type,
        value,
        object,
        number){
//"use strict";

/* Refs
 ******************************************************************************/
var functionPrototypeRef = new value_reference.ValueReference();

var functionPrototypeCallRef = new value_reference.ValueReference();

/* FunctionPrototype
 ******************************************************************************/
/**
 * Hosted language prototype object for functions.
 */
var FunctionPrototype = function() {
    var builtin_object = require('atum/builtin/object');
    meta_func.FunctionPrototype.call(this, builtin_object.objectPrototype, {
        'call': {
            'value': functionPrototypeCallRef
        },
        'prototype': {
            'value': builtin_object.objectPrototypeRef
        }
    })
};

FunctionPrototype.prototype = new meta_func.FunctionPrototype;

/**
 * `Function.prototype.call`
 */
var functionPrototypeCall = function(ref, thisObj, args) {
    return compute.bind(thisObj.getValue(), function(t) {
        if (!value.isCallable(t)) {
            return compute.error();
        }
        return t.call(ref, args[0], args.slice(1));
    });
};

/* Function
 ******************************************************************************/
/**
 * 
 */
var Function = function() {
    object.Object.call(this, null, {
        'prototype': {
            'value': functionPrototypeRef,
            'writable': false,
            'configurable': false,
            'enumerable': false
        },
        'length': {
            'value': new number.Number(1),
            'writable': false,
            'configurable': false,
            'enumerable': false
        }
    });
};

Function.prototype = new object.Object;
Function.prototype.constructor = Function;


/* Initialize
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function')
    return compute.sequence(
        functionPrototypeRef.setValue(new FunctionPrototype()),
        functionPrototypeCallRef.setValue(builtin_function.create('toString', 0, functionPrototypeCall)));
};

/* Export
 ******************************************************************************/
exports.Function = Function;
exports.FunctionPrototype = FunctionPrototype;

exports.functionPrototypeRef = functionPrototypeRef;

exports.initialize = initialize;

});