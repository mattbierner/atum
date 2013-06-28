/**
 * @fileOverview Record for a debuggable state.
 */
define(['atum/value/value',
        'atum/value/type'],
function(value,
        type) {
"use strict";

/* Debuggable
 ******************************************************************************/
var Debuggable = function(k, ctx) {
    this.ctx = ctx;
    this.k = k;
};


var DebuggerDebuggable = function(k, ctx) {
    
};
DebuggerDebuggable.prototype = new Debuggable;


/* Export
 ******************************************************************************/
return {
    'Debuggable': Debuggable,
    'DebuggerDebuggable': DebuggerDebuggable
};

});