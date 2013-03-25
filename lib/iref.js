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

Iref.prototype.toString = function() {
    return "{Iref " + this.key + "}";
};

Iref.prototype.dereference = function() {
    return compute.getValue(this.key);
};

Iref.prototype.set = function(value) {
    return compute.next(
        compute.setValue(this.key, value),
        compute.always(this));
};

/* Export
 ******************************************************************************/
return {
    'Iref': Iref
};

});