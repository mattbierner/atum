/**
 * @fileOverview
 */
define(['amulet/record'],
function(record) {
"use strict";

/* ExecutionMetadata
 ******************************************************************************/
/**
 */
var ExecutionMetadata = record.declare(null, [
    'stack',
    'loc']);

var setStack = ExecutionMetadata.setStack;

var setLocation = ExecutionMetadata.setLoc;

/* Constants
 ******************************************************************************/
/**
 * 
 */
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