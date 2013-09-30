/**
 * @fileOverview PropertyReference reference type.
 */
define(['exports',
        'atum/compute',
        'atum/internal_reference',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/object',
        'atum/operations/type_conversion',
        'atum/value/value'],
function(exports,
        compute,
        internal_reference,
        boolean,
        error,
        execution_context,
        internal_reference_operations,
        object,
        type_conversion,
        value) {
"use strict";

/* Property Reference
 ******************************************************************************/
/**
 * Language level reference to a property stored in a base object.
 */
var PropertyReference = function(name, base, strict) {
    this.name = name + '';
    this.base = base;
    this.strict = !!strict;
    
    this.isUnresolvable = !base;
    this.hasPrimitiveBase = (!this.isUnresolvable && (value.isBoolean(base) || value.isString(base) || value.isNumber(base)));
    this.isProperty = (!this.isUnresolvable && (value.isObject(base) || this.hasPrimitiveBase));
};
PropertyReference.prototype = new internal_reference.InternalReference;

/**
 * 
 */
PropertyReference.prototype.getBase = function(value) {
    return (this.isUnresolvable ?
        error.referenceError(string.create(this.name)) :
        compute.bind(
            internal_reference_operations.getValue(this.base),
            type_conversion.toObject));
};

/**
 * 
 */
PropertyReference.prototype.getValue = function() {
    var name = this.name;
    return compute.bind(this.getBase(), function(o){
        return object.get(o, name);
    });
};

/**
 * 
 */
PropertyReference.prototype.setValue = function(value) {
    var name = this.name;
    return compute.sequence(
        compute.bind(this.getBase(), function(o) {
            return object.set(o, name, value);
        }),
        compute.just(this));
};

/**
 * 
 */
PropertyReference.prototype.deleteReference = function() {
    if (!this.base) {
        if (this.strict)
            return error.syntaxError();
        return boolean.TRUE;
    }
    var name = this.name;
    return compute.bind(this.getBase(), function(base) {
        return object.deleteProperty(base, name);
    });
};

/* Operations
 ******************************************************************************/
/**
 * Create a new property reference.
 * 
 * Gets the strictness from the current environment.
 */
var create = function(name, base) {
    return compute.bind(
        execution_context.strict,
        function(strict) {
            return compute.just(new PropertyReference(name, base, strict));
        });
};

/* Exports 
 ******************************************************************************/
exports.PropertyReference = PropertyReference;

exports.create = create;

});