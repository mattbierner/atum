/**
 * @fileOverview
 * 
 * @TODO: hide details of irefs in computation value  logic.
 */
define(['atum/compute',
        'atum/internal_reference'],
function(compute,
        internal_reference) {
"use strict";

/* Iref
 ******************************************************************************/
/** 
 * Irefs are a specific case of internal references. The value they refer to
 * is stored in the computation context's values store.
 */
var Iref = function(key) {
    this.key = key;
};
Iref.prototype = new internal_reference.InternalReference;

/**
 * Create a new, unique Iref.
 */
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
        compute.just(this));
};

/* Export
 ******************************************************************************/
return {
    'Iref': Iref
};
});