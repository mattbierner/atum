/**
 * @fileOverview EnvironmentReference reference type.
 */
define(['exports',
        'atum/compute',
        'atum/internal_reference',
        'atum/operations/boolean',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/internal_reference',
        'atum/operations/string',
        'atum/operations/undef'],
function(exports,
        compute,
        internal_reference,
        boolean,
        environment,
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
    
    this.isUnresolvable = !base;
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
        return compute.branch(env.hasBinding(name, strict),
            env.getBindingValue(name, strict),
            undef.UNDEFINED);
    });
};

/**
 * Computation that sets the value stored in this reference.
 */
EnvironmentReference.prototype.setValue = function(value) {
    if (!this.base && this.strict)
        return error.referenceError(string.create(this.name));
    return environment.setEnvironmentMutableBinding(
        (this.base ? compute.just(this.base) : environment.getGlobal()),
        this.name,
        this.strict,
        compute.just(value));
};

/**
 * 
 */
EnvironmentReference.prototype.deleteReference = function() {
    if (!this.base) {
        if (this.strict)
            return error.syntaxError();
        return boolean.TRUE;
    }
    if (this.strict)
        return error.syntaxError();
    
    return environment.deleteEnvironmentBinding(
        compute.just(this.base),
        this.name);
};

/* Export
 ******************************************************************************/
exports.EnvironmentReference = EnvironmentReference;

});