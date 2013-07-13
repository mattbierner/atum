/**
 * @fileOverview The global builtin environment.
 */
define(['atum/compute',
        'atum/builtin/error',
        'atum/builtin/func',
        'atum/builtin/number',
        'atum/builtin/object',
        'atum/context/environment',
        'atum/context/execution_context',
        'atum/operations/environment',
        'atum/value/number',
        'atum/value/undef'],
function(compute,
        error,
        func,
        number_builtin,
        object,
        environment,
        execution_context,
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
    return compute.next(
        compute.sequence(
            environment_semantics.putEnvironmentImmutableBinding(ref, 'Infinity', false, compute.just(number.POSITIVE_INFINITY)),
            environment_semantics.putEnvironmentImmutableBinding(ref, 'NaN', false, compute.just(number.NaN)),
            environment_semantics.putEnvironmentImmutableBinding(ref, 'undefined', false, compute.just(undef.UNDEFINED)),
            
            environment_semantics.putEnvironmentMutableBinding(ref, 'Number', false, compute.just(number_builtin.numberRef)),
            environment_semantics.putEnvironmentMutableBinding(ref, 'Object', false, compute.just(object.objectRef))),
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