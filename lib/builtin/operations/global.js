/**
 * @fileOverview Global environment operations.
 */
define(['atum/compute',
        'atum/builtin/global',
        'atum/context/execution_context',
        'atum/context/execution_settings',
        'atum/operations/environment',
        'atum/operations/execution_context'],
function(compute,
        global_builtin,
        execution_context,
        execution_settings,
        environment,
        execution_context_operations) {
"use strict";

var globalExecutionContext = function(env, obj) {
    return execution_context.createGlobalContext(
        execution_settings.DEFAULTS,
        env,
        obj);
};

/* Operations
 ******************************************************************************/
/**
 * Create a new global execution context using the global object.
 */
var createGlobal = compute.bind(
    environment.createObjectEnvironment(global_builtin.global, null),
    function(lex) {
        return compute.just(globalExecutionContext(lex, global_builtin.global));
    });

/**
 * Sets the current execution context to a new global execution context.
 */
var enterGlobal = function() {
    return compute.bind(
        createGlobal,
        execution_context_operations.setContext);
};

/* Export
 ******************************************************************************/
return {
    'enterGlobal': enterGlobal
};

});