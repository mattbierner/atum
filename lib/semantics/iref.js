define(['atum/compute',
        'atum/iref'], 
function(compute,
        iref){
    
var create =  function(value) {
    return compute.bind(value, function(v) {
        var ir = iref.create();
        return function(ctx, ok, err) {
            return ok(ir, ctx.setValue(ir.key, v));
        }; 
    });
};

/**
 * 
 */
var getValue = function(ir) {
    if (!(ir instanceof iref.Iref)) {
        return compute.always(ir);
    }
    return compute.bind(compute.context, function(ctx) {
        return compute.always(ctx.getValue(ir.key));
    });
};

return {
    'create': create,
    'getValue': getValue
};

});