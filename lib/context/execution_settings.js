/**
 * @fileOverview Execution settings.
 */
define(['bes/record'],
function(record) {
"use strict";

/* ExecutionSettings
 ******************************************************************************/
/**
 * Settings for program execution.
 */
var ExecutionSettings = record.declare(null, [
    'maxStack']);

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
    'ExecutionSettings': ExecutionSettings,
    
// Defaults
    'MAX_STACK': MAX_STACK,
    
    'DEFAULTS': DEFAULTS
};

});