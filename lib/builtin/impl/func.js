/**
 * @fileOverview Hosted language function builtins.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/func',
        'atum/builtin/meta/func',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/object',
        'atum/value/type',
        'atum/value/undef',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        func_ref,
        meta_func,
        error,
        string,
        value_reference_semantics,
        number,
        object,
        type,
        undef,
        value){
//"use strict";
    
/* FunctionPrototype
 ******************************************************************************/
/**
 * Hosted language prototype object for functions.
 */
var FunctionPrototype = function() {
    var builtin_object = require('atum/builtin/object');
    meta_func.Function.call(this, builtin_object.ObjectPrototype, {
        'call': {
            'value': func_ref.FunctionPrototypeCall
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
    return compute.bind(
        value_reference_semantics.getValue(compute.just(thisObj)),
        function(t) {
            if (!value.isCallable(t))
                return error.typeError(string.empty);
            return t.call(ref, args.getArg(0), args.slice(1));
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
            'value': func_ref.FunctionPrototype,
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
        func_ref.Function.setValue(new Function()),
        func_ref.FunctionPrototype.setValue(new FunctionPrototype()),
        func_ref.FunctionPrototypeCall.setValue(builtin_function.create('toString', 0, functionPrototypeCall)));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Function = func_ref.Function;
exports.FunctionPrototype = func_ref.FunctionPrototype;

});