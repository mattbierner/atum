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
var debuggable = function(p) {
    return compute.binds(
        compute.sequence(
            compute.getComputeContext(),
            compute.getValues()),
        function(ctx, v) {
            return compute.next(compute.callcc(function(k) {
                return compute.abrupt(new atum_debuggable.Debuggable(ctx, v, k));
            }), p);
        });
};

/* Export
 ******************************************************************************/
return {
    'debuggable': debuggable
};

});