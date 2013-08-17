/**
 * @fileOverview Hosted language function builtins.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/func',
        'atum/operations/error',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/number',
        'atum/value/value'],
function(exports,
        compute,
        func_ref,
        builtin_object,
        meta_func,
        error,
        object,
        string,
        value_reference,
        value_args,
        number,
        value){
//"use strict";

/* FunctionPrototype
 ******************************************************************************/
/**
 * `Function.prototype`
 */
var FunctionPrototype = function() {
    meta_func.Function.call(this, this.proto, this.properties)
};
FunctionPrototype.prototype = new meta_func.Function;
FunctionPrototype.prototype.constructor = FunctionPrototype;

FunctionPrototype.prototype.proto = builtin_object.ObjectPrototype;

FunctionPrototype.prototype.properties = {
    'apply': {
        'value': func_ref.FunctionPrototypeApply
    },
    'call': {
        'value': func_ref.FunctionPrototypeCall
    },
    //'prototype': {
      //  'value': builtin_object.ObjectPrototype
    //}
};

/**
 * `Function.prototype.call(thisArg, ...args)`
 */
var functionPrototypeCall = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
        function(t) {
            if (!value.isCallable(t))
                return error.typeError();
            return t.call(ref, args.getArg(0), args.slice(1));
        });
};

/**
 * `Function.prototype.apply(thisArg, argArray)`
 */
var functionPrototypeApply = function(ref, thisObj, args) {
    return compute.bind(
        value_reference.getValue(compute.just(thisObj)),
        function(t) {
            if (!value.isCallable(t))
                return error.typeError();
            
            var thisArg = args.getArg(0),
                argArray = args.getArg(1);
            return compute.bind(value_reference.getValue(compute.just(argArray)), function(argArray) {
                if (value.isUndefined(argArray) || value.isNull(argArray))
                    return functionPrototypeCall(ref, thisObj, args);
                else if (!value.isObject(argArray))
                    return error.typeError();
                
                var argList = new value_args.Args([]);
                return compute.bind(object.get(compute.just(argArray), 'length'), function(len) {
                    return (function loop(i, args) {
                        return (i >= len.value ?
                            t.call(ref, thisArg, args) :
                            compute.bind(object.get(compute.just(argArray), i + ''), function(nextArg) {
                                return loop(i + 1, args.append(nextArg));
                            }));
                    }(0, argList));
                });
            });
        });
};

/* Function
 ******************************************************************************/
/**
 * `Function`
 */
var Function = function() {
    meta_func.Function.call(this, this.proto, this.properties);
};

Function.prototype = new meta_func.Function;
Function.prototype.constructor = Function;

Function.prototype.proto = null;

Function.prototype.properties = {
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
};

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
        value_reference.setValue(compute.just(func_ref.FunctionPrototypeApply), builtin_function.create('apply', 2, functionPrototypeApply)),
        value_reference.setValue(compute.just(func_ref.FunctionPrototypeCall), builtin_function.create('call', 1, functionPrototypeCall)));
};

/* Export
 ******************************************************************************/
exports.initialize = initialize;

exports.Function = func_ref.Function;
exports.FunctionPrototype = func_ref.FunctionPrototype;

});