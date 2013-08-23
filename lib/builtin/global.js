/**
 * @fileOverview The global builtin environment.
 */
define(['atum/compute',
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
        'atum/value/number',
        'atum/value/undef'],
function(compute,
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
var globalExecutionContext = function(env) {
    return new execution_context.ExecutionContext(
        execution_context.ExecutionContextType.GLOBAL,
        execution_settings.DEFAULTS,
        false,
        env,
        env,
        env,
        env,
        []);
};

/* Environment
 ******************************************************************************/
var createGlobalBindings = function(ref) {
    var immutableBinding = function(name, value) {
        return environment_semantics.putEnvironmentImmutableBinding(ref, name, false, compute.just(value));
    };
    var mutableBinding = function(name, value) {
        return environment_semantics.putEnvironmentMutableBinding(ref, name, false, compute.just(value));
    };
    
    return compute.sequence(
        immutableBinding('Infinity', number.POSITIVE_INFINITY),
        immutableBinding('NaN', number.NaN),
        immutableBinding('undefined', undef.UNDEFINED),
        
        mutableBinding('Array', array.Array),
        mutableBinding('Error', error.errorRef),
        mutableBinding('EvalError', native_errors.EvalError),
        mutableBinding('Function', func.Function),
        mutableBinding('Number', number_builtin.Number),
        mutableBinding('Object', object.Object),
        mutableBinding('RangeError', native_errors.RangeError),
        mutableBinding('ReferenceError', native_errors.ReferenceError),
        mutableBinding('SyntaxError', native_errors.SyntaxError),
        mutableBinding('TypeError', native_errors.TypeError),
        mutableBinding('UriError', native_errors.UriError),
        
        ref);
};

var createGlobalEnvironment = function() {
    return environment_semantics.createDeclativeEnvironment();
};

/* Global
 ******************************************************************************/
var createGlobal = function() {
    return compute.bind(createGlobalEnvironment(), function(lex) {
        return compute.next(
            createGlobalBindings(compute.just(lex)),
            compute.just(new globalExecutionContext(lex)));
    });
};

/**
 * Sets the current execution context to a new global execution context.
 */
var enterGlobal = function() {
    return compute.bind(createGlobal(), compute.setContext);
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