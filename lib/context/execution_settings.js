/**
 * @fileOverview
 */
define([],
function() {
"use strict";

/* Constants
 ******************************************************************************/
/**
 * Default maximum size of call stack.
 */
var MAX_STACK = 1000;

/* ExecutionSettings
 ******************************************************************************/
/**
 */
var ExecutionSettings = function(maxStack) {
    this.maxStack = maxStack;
};

/* Defaults
 ******************************************************************************/
var DEFAULTS = new ExecutionSettings(
    MAX_STACK);

/* Export
 ******************************************************************************/
return {
    'ExecutionSettings': ExecutionSettings,
    
    'DEFAULTS': DEFAULTS
};

});