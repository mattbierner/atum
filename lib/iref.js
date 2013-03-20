/**
 * @fileOverview Internal reference type.
 */
define(['atum/compute',
        'atum/reference'],
function(compute,
        reference) {
//"use strict";
    
/* Iref
 ******************************************************************************/
var Iref = (function(){
    var counter = 0;

    return function() {
        this.key = counter++;
        this.isUnresolvable = false;
    };
}());
Iref.prototype = new reference.Reference;

Iref.prototype.dereference = function() {
    var key = this.key;
    return compute.bind(
        compute.context,
        function(ctx) {
            return compute.always(ctx.values[key]);
        });
};

Iref.prototype.set = function(value) {
    var key = this.key;
    return compute.bind(value, function(v) {
        return function(ctx, ok, err) {
            return ok(value, ctx.setValue(key, v));
        };
    });
};

/* Errors
 ******************************************************************************/
return {
    'Iref': Iref
};

});