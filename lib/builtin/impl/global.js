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
        'atum/builtin/impl/array',
        'atum/builtin/impl/error',
        'atum/builtin/impl/func',
        'atum/builtin/impl/native_errors',
        'atum/builtin/impl/number',
        'atum/builtin/impl/object',
        'atum/context/execution_context',
        'atum/context/execution_settings',
        'atum/operations/environment',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/undef'],
function(compute,
        value_reference,
        array,
        error,
        func,
        native_errors,
        number_builtin,
        object,
        impl_array,
        impl_error,
        impl_func,
        impl_native_errors,
        impl_number_builtin,
        impl_object,
        execution_context,
        execution_settings,
        environment_semantics,
        object_operations,
        value_reference,
        number,
        undef) {
//"use strict";

/* Operations
 ******************************************************************************/
var globalEval = function(x) { };

var globalParseInt;

var globalParseFloat;

var globalIsNaN;

var globalIsFinite;

var decodeURI;

var decodeURIComponent;

var encodeURI;

var encodeURIComponent;

/* Execution Context
 ******************************************************************************/
var globalExecutionContext = function(env, obj) {
    return new execution_context.ExecutionContext(
        execution_context.ExecutionContextType.GLOBAL,
        execution_settings.DEFAULTS,
        false,
        env,
        env,
        obj,
        env,
        []);
};

/* Global Object 
 ******************************************************************************/
var globalRef;// = new value_reference.ValueReference();

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
        mutableBinding('Error', error.Error),
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

/* Initialize
 ******************************************************************************/
var initialize = function() {
    return compute.sequence(
        impl_object.initialize(),
        impl_array.initialize(),
        impl_error.initialize(),
        impl_native_errors.initialize(),
        impl_func.initialize(),
        impl_number_builtin.initialize());
};

/* Export
 ******************************************************************************/
return {
    'initialize': initialize,
    
    'enterGlobal': enterGlobal
};

});