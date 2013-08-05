/**
 * @fileOverview EnvironmentReference reference type.
 */
define(['exports',
        'atum/compute',
        'atum/internal_reference',
        'atum/context/environment_record',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/internal_reference',
        'atum/operations/string',
        'atum/operations/undef'],
function(exports,
        compute,
        internal_reference,
        environment_record,
        environment_operations,
        error,
        internal_reference_semantics,
        string,
        undef) {
"use strict";

/* Environment Reference
 ******************************************************************************/
/**
 * Reference to a value in an environment.
 * 
 * @param {String} name Identifier used to lookup referenced value.
 * @param [base] Reference to the object storing the referenced value. If null,
 *    assumed to be the global object.
 * @param {Boolean} [strict] Is the reference strict.
 */
var EnvironmentReference = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
};
EnvironmentReference.prototype = new internal_reference.InternalReference;

/**
 * 
 */
EnvironmentReference.prototype.getBase = function() {
    if (!this.base)
        return error.referenceError(string.create(this.name))
    return internal_reference_semantics.getValue(compute.just(this.base));
};

/**
 * Computation that dereferences the stored value.
 * 
 * Errors if the value cannot be dereferenced.
 */
EnvironmentReference.prototype.getValue = function() {
    var name = this.name,
        strict = this.strict;
    return compute.bind(this.getBase(), function(env) {
        return (environment_record.hasBinding(env.record, name, strict) ?
            compute.just(environment_record.getBindingValue(env.record, name, strict)) : 
            undef.UNDEFINED);
    });
};

/**
 * Computation that sets the value stored in this reference.
 */
EnvironmentReference.prototype.setValue = function(value) {
    if (!this.base && this.strict)
        return error.referenceError(string.create(this.name));
    return environment_operations.setEnvironmentMutableBinding(
        (this.base ? compute.just(this.base) : environment_operations.getGlobal()),
        this.name,
        this.strict,
        compute.just(value));
};

/* Export
 ******************************************************************************/
// EnvironmentReference
exports.EnvironmentReference = EnvironmentReference;

});