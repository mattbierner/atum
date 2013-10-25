/**
 * @fileOverview
 */
define(['amulet/record',
        'atum/compute',
        'atum/internal_reference'],
function(record,
        compute,
        internal_reference) {
"use strict";

/* Iref
 ******************************************************************************/
/** 
 * Irefs are a specific case of internal references. The value they refer to
 * is stored in the computation context's value store.
 */
var Iref = record.declare(new internal_reference.InternalReference, [
    'key']);

Iref.prefix = "iref:";

Iref.prototype.getValue = function() {
    return compute.getValue(Iref.prefix + this.key);
};

Iref.prototype.setValue = function(x) {
    return compute.next(
        compute.setValue(Iref.prefix + this.key, x),
        compute.just(this));
};

/* Export
 ******************************************************************************/
return {
    'Iref': Iref
};

});