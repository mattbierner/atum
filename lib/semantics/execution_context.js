/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['atum/compute',
        'atum/iref',
        'atum/reference',
        'atum/context/environment',
        'atum/context/environment_record',
        'atum/semantics/reference',
        'atum/value/undef'],
function(compute,
        iref,
        reference,
        environment,
        environment_record,
        reference_semantics,
        undef) {
//"use strict";

/* Computations
 ******************************************************************************/
var getThisBinding= function() {
    return compute.extract(function(ctx) {
        return ctx.thisBinding;
    });
};

var modifyThisBinding = function(f) {
    return compute.bind(getThisBinding(), function(t){
        return compute.modifyContext(function(ctx) {
            return ctx.setThisBinding(f(t));
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
    'getThisBinding': getThisBinding,
    'withThisBinding': withThisBinding
};

});