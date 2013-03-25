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
    return this.iref.set(value);
};

/* Export
 ******************************************************************************/
return {
    'ValueReference': ValueReference
};

});