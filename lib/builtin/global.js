/**
 * @fileOverview The global builtin environment.
 */
define(['atum/compute',
        'atum/value_reference',
        'atum/builtin/array',
        'atum/builtin/error',
        'atum/builtin/func',
        'atum/builtin/native_errors',
        'atum/builtin/number',
        'atum/builtin/object',
        'atum/builtin/impl/args',
        'atum/builtin/impl/array',
        'atum/builtin/impl/error',
        'atum/builtin/impl/func',
        'atum/builtin/impl/native_errors',
        'atum/builtin/impl/number',
        'atum/builtin/impl/object',
        'atum/context/execution_context',
        'atum/context/execution_settings',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/evaluation',
        'atum/operations/object',
        'atum/operations/string',
        'atum/value/number',
        'atum/value/undef',
        'atum/value/value',
        'text!atum/builtin/hosted/global.js'],
function(compute,
        value_reference,
        array,
        builtin_error,
        func,
        native_errors,
        number_builtin,
        object,
        impl_args,
        impl_array,
        impl_error,
        impl_func,
        impl_native_errors,
        impl_number_builtin,
        impl_object,
        execution_context,
        execution_settings,
        environment_semantics,
        error,
        execution_context_operations,
        evaluation,
        object_operations,
        string,
        number,
        undef,
        value) {
//"use strict";

/* Global Functions
 ******************************************************************************/
var globalEval = function(ref, thisBinding, args) {
    var x = args.getArg(0);
    if (!value.isString(x))
        return compute.just(x);
    return evaluation.evaluate(x.value);
};

var globalParseInt;

var globalParseFloat;

var decodeURI;

var decodeURIComponent;

var encodeURI;

var encodeURIComponent;

/* Execution Context
 ******************************************************************************/
var globalExecutionContext = function(env, obj) {
    return new execution_context.createGlobalContext(
        execution_settings.DEFAULTS,
        env,
        obj);
};

/* Global Object 
 ******************************************************************************/
var globalRef = new value_reference.ValueReference();
var evalRef = new value_reference.ValueReference();

/* Environment
 ******************************************************************************/
var createGlobalObject = function() {
    return object_operations.create(null, {
        'Infinity': {
            'value': number.POSITIVE_INFINITY,
            'enumerable': false,
            'writable': false,
            'configurable': false
        },
        'NaN': {
            'value': number.NaN,
            'enumerable': false,
            'writable': false,
            'configurable': false
        },
        'undefined': {
            'value': undef.UNDEFINED,
            'enumerable': false,
            'writable': false,
            'configurable': false
        }
    });
};

var createGlobalBindings = function() {
    var immutableBinding = function(name, value) {
        return environment_semantics.putStrictnessImmutableBinding(name, false, compute.just(value));
    };
    var mutableBinding = function(name, value) {
        return environment_semantics.putStrictnessMutableBinding(name, false, compute.just(value));
    };
    
    return compute.sequence(
        mutableBinding('Array', array.Array),
        mutableBinding('Error', builtin_error.Error),
        mutableBinding('eval', evalRef),
        mutableBinding('EvalError', native_errors.EvalError),
        mutableBinding('Function', func.Function),
        mutableBinding('Number', number_builtin.Number),
        mutableBinding('Object', object.Object),
        mutableBinding('RangeError', native_errors.RangeError),
        mutableBinding('ReferenceError', native_errors.ReferenceError),
        mutableBinding('SyntaxError', native_errors.SyntaxError),
        mutableBinding('TypeError', native_errors.TypeError),
        mutableBinding('UriError', native_errors.UriError));
};


/* Global
 ******************************************************************************/
var createGlobal = function() {
    return compute.bind(createGlobalObject(), function(obj) {
        return compute.bind(
            environment_semantics.createObjectEnvironment(null, obj),
            function(lex) {
                return compute.just(globalExecutionContext(lex, obj));
            });
    });
};

/**
 * Sets the current execution context to a new global execution context.
 */
var enterGlobal = function() {
    return compute.sequence(
        compute.bind(createGlobal(), compute.setContext),
        createGlobalBindings());

};

var initializeGlobal = function() {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        builtin_function.create(evalRef, 'eval', 1, globalEval),
        
        evaluation.evaluateFile('atum/builtin/hosted/global.js'));
};

/* Initialize
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        impl_object.initialize(),
        impl_args.initialize(),
        impl_array.initialize(),
        impl_error.initialize(),
        impl_native_errors.initialize(),
        impl_func.initialize(),
        impl_number_builtin.initialize(),
        initializeGlobal());
};

/* Export
 ******************************************************************************/
return {
    'initialize': initialize,
    
    'enterGlobal': enterGlobal
};

});