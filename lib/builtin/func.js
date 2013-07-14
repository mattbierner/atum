/**
 * @fileOverview Hosted language function builtins.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/meta/func',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/object',
        'atum/value/type',
        'atum/value/undef',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        meta_func,
        value_reference_semantics,
        number,
        object,
        type,
        undef,
        value){
//"use strict";

/* Refs
 ******************************************************************************/
var functionRef = new value_reference.ValueReference();

var functionPrototypeRef = new value_reference.ValueReference();

var functionPrototypeCallRef = new value_reference.ValueReference();

/* FunctionPrototype
 ******************************************************************************/
/**
 * Hosted language prototype object for functions.
 */
var FunctionPrototype = function() {
    var builtin_object = require('atum/builtin/object');
    meta_func.Function.call(this, builtin_object.ObjectPrototype, {
        'call': {
            'value': functionPrototypeCallRef
        },
        'prototype': {
            'value': builtin_object.ObjectPrototype
        }
    })
};

FunctionPrototype.prototype = new meta_func.Function;

/**
 * `Function.prototype.call`
 */
var functionPrototypeCall = function(ref, thisObj, args) {
    return compute.bind(thisObj.getValue(), function(t) {
        if (!value.isCallable(t)) {
            return compute.error();
        }
        return t.call(ref, (args.length ? args[0] : undef.UNDEFINED), args.slice(1));
    });
};

/* Function
 ******************************************************************************/
/**
 * 
 */
var Function = function() {
    meta_func.Function.call(this, null, {
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

Function.prototype = new meta_func.Function;
Function.prototype.constructor = Function;

/**
 */
Function.prototype.call = null /*@TODO*/;

/**
 */
Function.prototype.construct = function(args) { };


/* Initialize
 ******************************************************************************/
var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function')
    return compute.sequence(
        functionRef.setValue(new Function()),
        functionPrototypeRef.setValue(new FunctionPrototype()),
        functionPrototypeCallRef.setValue(builtin_function.create('toString', 0, functionPrototypeCall)));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Function = functionRef;
exports.FunctionPrototype = functionPrototypeRef;

});