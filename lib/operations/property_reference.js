/**
 * @fileOverview PropertyReference reference type.
 */
define(['exports',
        'atum/compute',
        'atum/internal_reference',
        'atum/operations/error',
        'atum/operations/object',
        'atum/operations/internal_reference',
        'atum/operations/string',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        internal_reference,
        error,
        object,
        internal_reference_operations,
        string,
        value_reference,
        type,
        value) {
"use strict";

/* Property Reference
 ******************************************************************************/
/**
 * Language level reference to a property stored in a base object.
 */
var PropertyReference = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
    
    this.isUnresolvable = (base === undefined);
    this.hasPrimitiveBase = (!this.isUnresolvable && (value.isBoolean(base) || value.isString(base) || value.isNumber(base)));
    this.isProperty = (!this.isUnresolvable && (value.isObject(base) || this.hasPrimitiveBase));
};
PropertyReference.prototype = new internal_reference.InternalReference;

PropertyReference.prototype.getValue = function() {
    return object.get(this.getBase(), this.name);
};

PropertyReference.prototype.setValue = function(value) {
    return compute.sequence(
        object.set(this.getBase(), this.name, compute.just(value)),
        compute.just(this));
};

PropertyReference.prototype.getBase = function(value) {
    return (this.isUnresolvable ?
        error.referenceError(string.create(this.name)) :
        internal_reference_operations.getValue(compute.just(this.base)));
};

/* Exports 
 ******************************************************************************/
exports.PropertyReference = PropertyReference;

});