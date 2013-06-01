/**
 * @fileOverview 
 */
define(['atum/compute',
        'atum/internal_reference'],
function(compute,
        internal_reference) {
"use strict";

/* Iref
 ******************************************************************************/
/**
 * Internal reference type for a value stored in computation values.
 */
var Iref = function(key) {
    this.key = key;
};
Iref.prototype = new internal_reference.InternalReference;

Iref.create = (function(){
    var counter = 0;
    // @TODO Make this part of computations
    return function() {
        return new Iref(counter++);
    };
}());

Iref.prototype.toString = function() {
    return "{Iref " + this.key + "}";
};

Iref.prototype.getValue = function() {
    return compute.getValue(this.key);
};

Iref.prototype.setValue = function(x) {
    return compute.next(
        compute.setValue(this.key, x),
        compute.always(this));
};

/* Export
 ******************************************************************************/
return {
    'Iref': Iref
};
});