/**
 * @fileOverview `Function` builtin implementation.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/func',
        'atum/builtin/object',
        'atum/builtin/meta/bound_function',
        'atum/builtin/meta/object',
        'atum/builtin/operations/array',
        'atum/builtin/operations/builtin_constructor',
        'atum/builtin/operations/builtin_function',
        'atum/operations/construct',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/string',
        'atum/value/property',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        func_builtin,
        object_builtin,
        bound_function,
        meta_object,
        array_ops,
        builtin_constructor,
        builtin_function,
        construct,
        error,
        evaluation,
        func,
        object,
        string,
        type_conversion,
        value_reference,
        string_value,
        property,
        value){
"use strict";

/* Function
 ******************************************************************************/
/**
 * `Function(p1, p2, ..., pn, body)`
 */
var FunctionCall = function(ref, _, args) {
    return construct.constructForward(ref, args);
};

/**
 * `new Function(p1, p2, ..., pn, body)`
 */
var FunctionConstruct = function(ref, args) {
    if (args.length === 0)
        return construct.construct(ref, [string_value.EMPTY]);
    return compute.bind(
        compute.eager(compute.enumerationa(args.args.map(string.toHost))),
        function(args) {
            var parameterList = fun.slice(0, -1, args)
                .join(',');
            return evaluation.evaluateEvalText(
                "(function(" + parameterList + ") {" + args[args.length - 1] +"})");
        });
};

/**
 * `Function`
 */
var FunctionProperties = {
    'prototype':  property.createValuePropertyFlags(
        func_builtin.FunctionPrototype)
};

/* FunctionPrototype
 ******************************************************************************/
/**
 * `Function.prototype`
 */
var FunctionPrototype = new meta_object.Object(
    object_builtin.ObjectPrototype, {
        'apply': property.createValuePropertyFlags(
            func_builtin.FunctionPrototypeApply,
            property.CONFIGURABLE | property.WRITABLE),
        
        'bind': property.createValuePropertyFlags(
            func_builtin.FunctionPrototypeBind,
            property.CONFIGURABLE | property.WRITABLE),
        
        'call': property.createValuePropertyFlags(
            func_builtin.FunctionPrototypeCall,
            property.CONFIGURABLE | property.WRITABLE),
        
        'constructor': property.createValuePropertyFlags(
            func_builtin.Function)
    },
    true);

/**
 * `Function.prototype.apply(thisArg, argArray)`
 */
var functionPrototypeApply = function(ref, thisObj, args) {
    var thisArg = args.getArg(0),
        argArray = args.getArg(1);
    
    return value_reference.dereference(thisObj, function(t) {
        if (!value.isCallable(t))
            return error.typeError("Function.prototype.apply on non-callable object");
        
        return value_reference.dereference(argArray, function(argArray) {
            if (value.isUndefined(argArray) || value.isNull(argArray))
                return func.apply(thisObj, thisArg, args);
            else if (!value.isObject(argArray))
                return error.typeError("Function.prototype.apply non object argument array");
            
            return func.functionCall(
                thisObj,
                thisArg,
                array_ops.toHost(argArray));
        });
    });
};

/**
 * `Function.prototype.bind(thisArg, ...args)`
 */
var functionPrototypeBind = function(ref, thisObj, args) {
    var thisArg = args.getArg(0),
        boundArgs = args.slice(1);
    
    return value_reference.dereference(thisObj, function(t) {
        if (!value.isCallable(t))
            return error.typeError("Function.prototype.bind on non-callable object");
        
        return value_reference.create(
            new bound_function.BoundFunction(
                func_builtin.FunctionPrototype,
                {},
                true,
                thisObj,
                thisArg,
                boundArgs));
    });
};

/**
 * `Function.prototype.call(thisArg, ...args)`
 */
var functionPrototypeCall = function(ref, thisObj, args) {
    return value_reference.dereference(thisObj, function(t) {
        if (!value.isCallable(t))
            return error.typeError("Function.prototype.call on non-callable object");
        
        return func.functionForward(
            thisObj,
            args.getArg(0),
            args.slice(1));
    });
};

/* Initialize
 ******************************************************************************/
var preinit = function() {
    return compute.sequence(
        func_builtin.FunctionPrototype.setValue(FunctionPrototype));
};

var initialize = function() {
    return compute.sequence(
        builtin_constructor.create(func_builtin.Function, 'Function', 1, FunctionProperties, FunctionCall, FunctionConstruct),

        builtin_function.create(func_builtin.FunctionPrototypeApply, 'apply', 2, functionPrototypeApply),
        builtin_function.create(func_builtin.FunctionPrototypeBind, 'bind', 1, functionPrototypeBind),
        builtin_function.create(func_builtin.FunctionPrototypeCall, 'call', 1, functionPrototypeCall));
};

var configure = function(mutableBinding, immutableBinding) {
    return mutableBinding('Function', func_builtin.Function);
};

/* Export
 ******************************************************************************/
exports.preinit = preinit;
exports.initialize = initialize;
exports.configure = configure;

});