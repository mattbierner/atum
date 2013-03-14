/**
 * 
 */
define(['atum/compute'],
function(compute){

var Iref = function(key) {
    this.key = key;
};

Iref.prototype.toString = function() {
    return "{Iref " + this.key + "}";
};

/**
 * 
 */
var create =  (function(){
    // TODO: ugly shared var!
    var counter = 0;
    
    return function(value) {
        var key = counter++;
        return compute.bind(value, function(v) {
            return function(ctx, ok, err) {
                return ok(new Iref(key), ctx.setValue(key, v));
            }; 
        });
    };
}())

/**
 * 
 */
var getValue = function(iref) {
    if (!(iref instanceof Iref)) {
        return compute.always(iref);
    }
    return compute.bind(compute.context, function(ctx) {
        return compute.always(ctx.getValue(iref.key));
    });
};

return {
    'create': create,
    'getValue': getValue
};

});