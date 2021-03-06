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
        'atum/value/property',
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
        property,
        value) {
"use strict";

/**
 * object.set for strict mode.
 */
var strictSetter = function(o, name, value) {
    return compute.bind(object.getProperty(o, name), function(prop) {
        if (prop) {
            if ((property.isDataDescriptor(prop) && !prop.writable))
                return error.typeError('Value for "' + name + '" is not writable');
            else if ((property.isAccessorDescriptor(prop) && !prop.set))
                return error.typeError('Accessor for "' + name + '" has no setter');
        } else {
            return compute.branch(object.isExtensible(o),
                object.set(o, name, value),
                error.typeError());
        }
        return object.set(o, nam, value);
    });
};

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

    this.getBase = (this.isUnresolvable ?
        error.referenceError(this.name) :
        internal_reference_operations.dereference(this.base, type_conversion.toObject));
    
    this.thisValue = this.getBase;
};
PropertyReference.prototype = new internal_reference.InternalReference;

/**
 * Get the value stored for this reference.
 */
PropertyReference.prototype.getValue = function() {
    var name = this.name;
    return compute.bind(this.getBase, function(o){
        return object.get(o, name);
    });
};

/**
 * Set the value stored for this reference.
 */
PropertyReference.prototype.setValue = function(value) {
    var name = this.name, strict = this.strict;
    return compute.next(
        compute.bind(this.getBase, function(o) {
            return (strict ? strictSetter : object.set)(o, name, value);
        }),
        compute.just(this));
};

/**
 * Delete the value stored for this reference.
 */
PropertyReference.prototype.deleteReference = function() {
    if (this.isUnresolvable) {
        if (this.strict)
            return error.syntaxError();
        return compute.yes;
    }
    var name = this.name,
        strict = this.strict;
    return compute.bind(this.getBase, function(base) {
        return object.deleteStrictnessProperty(base, strict, name);
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
    return compute.map(
        execution_context.strict,
        function(strict) {
            return new PropertyReference(name, base, strict);
        });
};

/* Exports 
 ******************************************************************************/
exports.PropertyReference = PropertyReference;

exports.create = create;

});