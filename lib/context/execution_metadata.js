/**
 * @fileOverview Execution context metadata.
 */
define(['amulet/record'],
function(record) {
"use strict";

/* ExecutionMetadata
 ******************************************************************************/
/**
 * Execution context metadata.
 * 
 * Stores data that is not directly used for execution but may be useful for
 * tooling.
 * 
 * @member stack Array of stack frames for the complete stack.
 * @member loc Program kocation of execution.
 * @member errorHandlers Array of error handlers for complete error handler stack.
 */
var ExecutionMetadata = record.declare(null, [
    'stack',
    'loc',
    'errorHandlers']);

/**
 * Empty execution context metadata
 */
var empty = new ExecutionMetadata([], null, []);

/* Export
 ******************************************************************************/
return {
    'ExecutionMetadata': ExecutionMetadata,

    'empty': empty
};

});