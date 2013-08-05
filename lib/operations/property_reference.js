/**
 * 
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
        internal_reference_semantics,
        string,
        value_reference,
        type,
        value) {
//"use strict";

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

    if (!this.isUnresolvable) {
        switch (value.type(base))
        {
        case type.BOOLEAN_TYPE:
        case type.STRING_TYPE:
        case type.NUMBER_TYPE:
            this.hasPrimitiveBase = true;
            break;
        default:
            this.hasPrimitiveBase = false;
            break;
        }
        this.isProperty = (value.isObject(base) || this.hasPrimitiveBase);
    } else {
        this.isProperty =  false;
        this.hasPrimitiveBase = false;
    }
};
PropertyReference.prototype = new internal_reference.InternalReference;

PropertyReference.prototype.getValue = function() {
    return object.get(this.getBase(), this.name);
};

PropertyReference.prototype.setValue = function(value) {
    var name = this.name;
    return compute.next(
        compute.bind(this.getBase(), function(base) {
            return compute.bind(value_reference.getValue(compute.just(base)), function(baseObj) {
                return baseObj.set(base, name, value);
            });
        }),
        compute.just(this));
};

PropertyReference.prototype.getBase = function(value) {
    return (this.isUnresolvable ?
        error.referenceError(string.create(this.name)) :
        internal_reference_semantics.getValue(compute.just(this.base)));
};

/* 
 ******************************************************************************/
exports.PropertyReference = PropertyReference;


});