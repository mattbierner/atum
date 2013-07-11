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
    Debuggable.call(this, k, ctx);
};
DebuggerDebuggable.prototype = new Debuggable;


var PreCallDebuggable = function(k, ctx) {
    Debuggable.call(this, k, ctx);
};
PreCallDebuggable.prototype = new Debuggable;

var PostCallDebuggable = function(k, ctx) {
    Debuggable.call(this, k, ctx);
};
PostCallDebuggable.prototype = new Debuggable;

/* Export
 ******************************************************************************/
return {
    'Debuggable': Debuggable,
    'DebuggerDebuggable': DebuggerDebuggable,
    
    'PreCallDebuggable': PreCallDebuggable,
    'PostCallDebuggable': PostCallDebuggable
};

});