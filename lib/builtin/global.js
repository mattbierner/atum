/**
 * @fileOverview The global builtin environment.
 */
define(['atum/compute',
        'atum/builtin/error',
        'atum/builtin/func',
        'atum/builtin/native_errors',
        'atum/builtin/number',
        'atum/builtin/object',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/context/execution_settings',
        'atum/operations/environment',
        'atum/value/number',
        'atum/value/undef'],
function(compute,
        error,
        func,
        native_errors,
        number_builtin,
        object,
        environment,
        execution_context,
        execution_settings,
        environment_semantics,
        number,
        undef) {
//"use strict";

/* Operations
 ******************************************************************************/
var globalEval = function(x) {
    if (type(x) !== 'String') {
        return x;
    };
};

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
    
    return compute.next(
        compute.sequence(
            immutableBinding('Infinity', number.POSITIVE_INFINITY),
            immutableBinding('NaN', number.NaN),
            immutableBinding('undefined', undef.UNDEFINED),
            
            mutableBinding('Error', error.errorRef),
            mutableBinding('Function', func.Function),
            mutableBinding('Number', number_builtin.numberRef),
            mutableBinding('Object', object.objectRef),
            mutableBinding('ReferenceError', native_errors.referenceErrorRef)),
        ref);
};

var createGlobalEnvironment = function() {
    return environment_semantics.createObjectEnvironment();
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
        object.initialize(),
        error.initialize(),
        native_errors.initialize(),
        func.initialize(),
        number_builtin.initialize());
};

/* Export
 ******************************************************************************/
return {
    'initialize': initialize,
    
    'enterGlobal': enterGlobal
};

});