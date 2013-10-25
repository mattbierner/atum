/**
 * @fileOverview Stack frame.
 */
define(['amulet/record'],
function(record) {
"use strict";

/* StackFrame
 ******************************************************************************/
var StackFrame = record.declare(null, [
    'func',
    'env']);

/* Export
 ******************************************************************************/
return {
    'StackFrame': StackFrame
};

});