/**
 * @fileOverview Stack frame.
 */
define([],
function() {
"use strict";

/* StackFrame
 ******************************************************************************/
var StackFrame = function(name) {
    this.name = name;
};


/* Export
 ******************************************************************************/
return {
    'StackFrame': StackFrame
};

});