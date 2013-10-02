/**
 * @fileOverview Operations for interacting with execution context settings.
 */
define(['atum/fun',
        'atum/context/execution_context',
        'atum/operations/execution_context'],
function(fun,
        context_execution_context,
        execution_context) {
"use strict";

/* Base Operations
 ******************************************************************************/
/**
 * Computation to extract a value from the current settings with `f`.
 */
var extract = function(f) {
    return execution_context.extract(function(ctx) {
        return f(ctx.settings);
    });
};

/**
 * Computation to get the current execution context settings.
 */
var settings = extract(fun.identity);

/**
 * Computation to modify the current execution context settings with `f`.
 */
var modifySettings = function(f) {
    return execution_context.modifyContext(function(ctx) {
        return context_execution_context.setSettings(ctx, f(ctx.settings));
    });
};

/**
 * Computation to set the current execution context settings to `settings`.
 */
var setSettings = fun.compose(
    modifySettings,
    fun.constant);

/* Query Operations
 ******************************************************************************/
/**
 * Computation to get the current maximum call stack size setting.
 */
var maxStack = extract(function(settings) {
    return settings.maxStack;
});

/* Export
 ******************************************************************************/
return {
// Base Operations
    'extract': extract,
    'settings': settings,
    'modifySettings': modifySettings,
    'setSettings': setSettings,
    
// Query Operations
    'maxStack': maxStack
};

});