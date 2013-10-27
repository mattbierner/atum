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
/**
 * 
 */
var debug = function(p, f) {
    return compute.bind(
        compute.computeContext,
        function(ctx) {
            return compute.next(compute.callcc(function(k) {
                return compute.abrupt(f(k, ctx));
            }), p);
        });
};

var debuggable = function(p) {
    return debug(p, atum_debuggable.Debuggable.create);
};

var debuggableStatement = function(p) {
    return debug(p, atum_debuggable.StatementDebuggable.create);
};

var debuggableCall = function(p) {
    return debug(
        compute.bind(p, function(x) {
            return debug(compute.just(x), function(ctx, k) {
                return new atum_debuggable.PostCallDebuggable(ctx, k);
            });
        }),
        function(ctx, k) {
            return new atum_debuggable.PreCallDebuggable(ctx, k);
        });
};


/* Export
 ******************************************************************************/
return {
    'debug': debug,
    
    'debuggable': debuggable,
    'debuggableStatement': debuggableStatement,
    'debuggableCall': debuggableCall,
};

});