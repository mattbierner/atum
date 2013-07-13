/**
 * @fileOverview Settings for execution context execution.
 */
define([],
function() {
"use strict";

/* ExecutionSettings
 ******************************************************************************/
/**
 * Stores settings for execution.
 */
var ExecutionSettings = function(maxStack) {
    this.maxStack = maxStack;
};

/* Defaults
 ******************************************************************************/
/**
 * Default maximum size of call stack.
 */
var MAX_STACK = 1000;

/**
 * Default settings.
 */
var DEFAULTS = new ExecutionSettings(
    MAX_STACK);

/* Export
 ******************************************************************************/
return {
// ExecutionSettings
    'ExecutionSettings': ExecutionSettings,
    
// Defaults
    'MAX_STACK': MAX_STACK,
    
    'DEFAULTS': DEFAULTS
};

});