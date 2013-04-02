/**
 * 
 */
define(['atum/compute',
        'atum/iref'],
function(compute,
        iref){

/* Value Reference
 ******************************************************************************/
var ValueReference = function() {
    this.iref = new iref.Iref();
};

ValueReference.prototype.toString = function() {
    return "{ValueReference " + this.iref.key + "}";
};

ValueReference.prototype.dereference = function() {
    return this.iref.dereference();
};

ValueReference.prototype.set = function(value) {
    return compute.next(
        this.iref.set(value),
        compute.always(this));
};

/* Export
 ******************************************************************************/
return {
    'ValueReference': ValueReference
};

});