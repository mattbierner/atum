/**
 * @fileOverview The global builtin environment.
 */
var hostParseInt = parseInt;

define(['atum/compute',
        'atum/fun',
        'atum/builtin/global',
        'atum/builtin/object',
        'atum/builtin/impl/args',
        'atum/builtin/impl/array',
        'atum/builtin/impl/boolean',
        'atum/builtin/impl/date',
        'atum/builtin/impl/error',
        'atum/builtin/impl/func',
        'atum/builtin/impl/math',
        'atum/builtin/impl/native_errors',
        'atum/builtin/impl/number',
        'atum/builtin/impl/object',
        'atum/builtin/impl/regexp',
        'atum/builtin/impl/string',
        'atum/builtin/meta/object',
        'atum/builtin/operations/builtin_function',
        'atum/builtin/operations/global',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/evaluation',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/property',
        'atum/value/undef',
        'atum/value/value',
        'atum/external/importScripts',
        'text!atum/builtin/hosted/global.js'],
function(compute,
        fun,
        global_builtin,
        object_builtin,
        impl_args,
        impl_array,
        impl_boolean,
        impl_date,
        impl_error,
        impl_func,
        impl_math,
        impl_native_errors,
        impl_number,
        impl_object,
        impl_regexp,
        impl_string,
        meta_object,
        builtin_function,
        global_ops,
        environment_semantics,
        error,
        evaluation,
        number_operations,
        object_operations,
        string,
        type_conversion,
        value_reference,
        number,
        property,
        undef,
        value,
        importScripts) {
"use strict";

/* Global Functions
 ******************************************************************************/
/**
 * `eval(x)`
 */
var globalEval = function(ref, thisBinding, args) {
    var x = args.getArg(0);
    return (value.isString(x) ?
        evaluation.evaluateText(x.value) :
        compute.just(x));
};

/**
 * `parseInt(str, radix)`
 */
var globalParseInt = function(ref, thisBinding, args) {
    var str = args.getArg(0),
        radix = args.getArg(1);
    return compute.binary(
        type_conversion.toString(str),
        type_conversion.toInt32(radix),
        function(str, r) {
            var stripPrefix = true;
            var rad = r.value, input = str.value.trim();
            if (r.value === 0) {
                rad = 10;
            } else if (r.value < 2 || r.value > 36) {
                return number_operations.NAN;
            } else if (r.value !== 16) {
                stripPrefix = false;
            }
            
            if (stripPrefix) {
                if (input.indexOf('0x') === 0 || input.indexOf('0X') === 0) {
                    input = input.slice(2);
                    rad = 16;
                }
            }
            
            return number_operations.create(hostParseInt(input, rad));
        });
};

var globalParseFloat;

var decodeURI;

var decodeURIComponent;

var encodeURI;

var encodeURIComponent;

/* Global Object
 ******************************************************************************/
var globalObject = new meta_object.Object(
    object_builtin.ObjectPrototype, {
        'Infinity': property.createValuePropertyFlags(
            number.POSITIVE_INFINITY),
        
        'NaN': property.createValuePropertyFlags(
            number.NaN),
        
        'undefined': property.createValuePropertyFlags(
            undef.UNDEFINED)
    },
    true);

/*
 ******************************************************************************/
var initializeGlobal = function() {
    return compute.sequence(
        global_builtin.global.setValue(globalObject),

        builtin_function.create(global_builtin.globalEval, 'eval', 1, globalEval),
        builtin_function.create(global_builtin.globalParseInt, 'parseInt', 1, globalParseInt));
};

var initilizeBuiltins = function() {
    return compute.sequence(
        impl_object.preinit(),
        impl_func.preinit(),
        
        impl_object.initialize(), // must be first
        impl_args.initialize(),
        impl_boolean.initialize(),
        impl_date.initialize(),
        impl_array.initialize(),
        impl_error.initialize(),
        impl_native_errors.initialize(),
        impl_func.initialize(),
        impl_math.initialize(),
        impl_number.initialize(),
        impl_string.initialize(),
        impl_regexp.initialize());
};

var initializeExternal = function() {
    return compute.sequence(
        importScripts.initialize());
};

var configureGlobal = function(mutableBinding) {
    return compute.sequence(
        mutableBinding('eval', global_builtin.globalEval),
        mutableBinding('parseInt', global_builtin.globalParseInt));
};

var configureBuiltins = function(mutableBinding, immutableBinding) {
    var configure = function(x) {
        return x.configure(mutableBinding, immutableBinding);
    };
    
    return compute.sequence(
        configure(impl_array),
        configure(impl_boolean),
        configure(impl_date),
        configure(impl_error),
        configure(impl_native_errors),
        configure(impl_func),
        configure(impl_math),
        configure(impl_number),
        configure(impl_object),
        configure(impl_string),
        configure(impl_regexp));
};

var configureExternal = function(mutableBinding, immutableBinding) {
    var configure = function(x) {
        return x.configure(mutableBinding, immutableBinding);
    };
    
    return compute.sequence(
        configure(importScripts));
};

var executeGlobal = function() {
    return evaluation.evaluateFile('atum/builtin/hosted/global.js');
};

var executeBuiltins = function() {
    return compute.sequence(
        impl_object.execute(),
        impl_math.execute(),
        impl_array.execute(),
        impl_regexp.execute(),
        impl_number.execute(),
        impl_string.execute(),
        impl_boolean.execute(),
        importScripts.execute());
};

var executeExternal = function() {
    return compute.sequence(
        importScripts.execute());
};

/* Global Initialization
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        initilizeBuiltins(), // must be first so object builtin is inited before everything
        initializeGlobal(),
        initializeExternal());
};

var configure = function() {
    var mutableBinding = fun.curry(
        environment_semantics.putStrictnessMutableBinding,
        false);
    
    var immutableBinding = fun.curry(
        environment_semantics.putStrictnessImmutableBinding,
        false);
    
    return compute.sequence(
        global_ops.enterGlobal(),
        configureGlobal(mutableBinding, immutableBinding),
        configureBuiltins(mutableBinding, immutableBinding),
        configureExternal(mutableBinding, immutableBinding));
};

var execute = function() {
    return compute.sequence(
        executeGlobal(),
        executeBuiltins(),
        executeExternal());
};

/* Initialization
 ******************************************************************************/
var globalInitialize = function() {
    return compute.sequence(
        initialize(),
        configure(),
        execute());
};

/* Export
 ******************************************************************************/
return {
    'initialize': globalInitialize};

});