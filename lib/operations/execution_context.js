/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['atum/compute',
        'atum/context/execution_context'],
function(compute,
        execution_context) {
//"use strict";

/* Computations
 ******************************************************************************/
var getGlobal = function() {
    return compute.extract(function(ctx) {
        return ctx.global;
    });
};


var getThisBinding= function() {
    return compute.extract(function(ctx) {
        return ctx.thisBinding;
    });
};

var modifyThisBinding = function(f) {
    return compute.bind(getThisBinding(), function(t){
        return compute.modifyContext(function(ctx) {
            return execution_context.setThisBinding(ctx, f(t));
        });
    });
};

var setThisBinding = function(t) {
    return modifyThisBinding(function() { return t; });
};

var withThisBinding = function(t, p) {
    return compute.bind(getThisBinding(), function(oldT) {
        return compute.next(
            setThisBinding(t),
            compute.then(p,
                setThisBinding(oldT)));
    });
};



/* Export
 ******************************************************************************/
return {
    'getGlobal': getGlobal,
    
    'getThisBinding': getThisBinding,
    'withThisBinding': withThisBinding
};

});