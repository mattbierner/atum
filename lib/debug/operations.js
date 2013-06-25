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
    return compute.next(
        compute.binds(
            compute.sequence(
                compute.getContext(),
                compute.values),
            function(ctx, v) {
                return compute.callcc(function(k) {
                    return compute.abrupt(new atum_debuggable.Debuggable(ctx, v, k));
                });
            }),
        p);
};

/* Export
 ******************************************************************************/
return {
    'debuggable': debuggable
};

});