/**
 * @fileOverview
 */
define([],
function() {
"use strict";

/* ExecutionMetadata
 ******************************************************************************/
/**
 */
var ExecutionMetadata = function(
    stack,
    loc
) {
    this.stack = stack;
    this.loc = loc;
};

/**
 * 
 */
var setStack = function(ctx, stack) {
    return new ExecutionMetadata(
        stack,
        ctx.loc);
};

/**
 * 
 */
var setLocation = function(ctx, loc) {
    return new ExecutionMetadata(
        ctx.stack,
        loc);
};

var empty = new ExecutionMetadata([], null);

/* Export
 ******************************************************************************/
return {
    'ExecutionMetadata': ExecutionMetadata,
    'empty': empty,
    
// Operations
    'setStack': setStack,
    'setLocation': setLocation
};

});