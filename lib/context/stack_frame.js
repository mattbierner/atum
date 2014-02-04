/**
 * @fileOverview Stack metadata
 */
define(['bes/record'],
function(record) {
"use strict";

/* StackFrame
 ******************************************************************************/
/**
 * Stack frame metadata object.
 * 
 * @member func The function for the current frame.
 * @member environment The frame's environment.
 * @member location Execution location in the stack frame.
 */
var StackFrame = record.declare(null, [
    'func',
    'environment',
    'location']);

/* Export
 ******************************************************************************/
return {
    'StackFrame': StackFrame
};

});