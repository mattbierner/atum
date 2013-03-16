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
var create = (function(){
    // TODO: ugly shared var!
    var counter = 0;
    
    return function() {
        var key = counter++;
        return new Iref(key);
    };
}());

var add = function(ctx, ir, value) {
    return ctx.setValue(ir.key, value);
};


/**
 * 
 */
var getValue = function(iref, ctx) {
    if (!(iref instanceof Iref)) {
        return iref;
    }
    return ctx.getValue(iref.key);
};

return {
    'Iref': Iref, 
    'create': create,
    'add': add,
    'getValue': getValue
};

});