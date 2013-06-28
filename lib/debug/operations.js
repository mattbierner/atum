/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/debug/debuggable'],
function(compute,
        atum_debuggable){
//"use strict";

/* 
 ******************************************************************************/
var debug = function(p, f) {
    return compute.bind(
        compute.getComputeContext(),
        function(ctx) {
            return compute.next(compute.callcc(function(k) {
                return compute.abrupt(f(k, ctx));
            }), p);
        });
};

var debuggable = function(p, f) {
    return debug(p, function(ctx, k) {
        return new atum_debuggable.Debuggable(ctx, k);
    });
};

var debuggerStatement = function(p, f) {
    return debug(p, function(ctx, k) {
        return new atum_debuggable.DebuggerDebuggable(ctx, k);
    });
};

/* Export
 ******************************************************************************/
return {
    'debuggable': debuggable,
    'debuggerStatement': debuggerStatement
};

});