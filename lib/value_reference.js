/**
 * @fileOverview Language level reference type.
 */
define(['atum/compute',
        'atum/reference',
        'atum/iref'],
function(compute,
        reference,
        iref){
"use strict";

/* Value Reference
 ******************************************************************************/
/**
 * Language level reference type.
 * Value references are used to represent hosted language object references.
 * 
 * @param [ref] Internal reference the value reference points to.
 */
var ValueReference = function(ref) {
    this.ref = (ref || iref.Iref.create());
};
ValueReference.prototype = new reference.Reference;

ValueReference.prototype.toString = function() {
    return "{ValueReference " + this.ref.key + "}";
};

ValueReference.prototype.getValue = function() {
    return this.ref.getValue();
};

ValueReference.prototype.modifyValue = function(f) {
    var self = this;
    return compute.bind(this.getValue(), function(x) {
        return self.setValue(f(x));
    });
};

ValueReference.prototype.setValue = function(value) {
    return compute.next(
        this.ref.setValue(value),
        compute.just(this));
};

/* Export
 ******************************************************************************/
return {
    'ValueReference': ValueReference
};

});