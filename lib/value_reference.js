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
 */
var ValueReference = function() {
    this.iref = iref.Iref.create();
};
ValueReference.prototype = new reference.Reference;

ValueReference.prototype.toString = function() {
    return "{ValueReference " + this.iref.key + "}";
};

ValueReference.prototype.getValue = function() {
    return this.iref.getValue();
};

ValueReference.prototype.setValue = function(value) {
    return compute.next(
        this.iref.setValue(value),
        compute.always(this));
};

/* Export
 ******************************************************************************/
return {
    'ValueReference': ValueReference
};
});