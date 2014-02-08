/**
 * @fileOverview EnvironmentReference reference type.
 */
define(['exports',
        'bes/record',
        'atum/compute',
        'atum/internal_reference',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/undef'],
function(exports,
        record,
        compute,
        internal_reference,
        environment,
        error,
        execution_context,
        internal_reference_operations,
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
var EnvironmentReference = record.declare(new internal_reference.InternalReference, [
    'name',
    'base',
    'strict'],
    function(name, base, strict) {
        this.name = name + '';
        this.base = base;
        this.strict = !!strict;
        
        this.isUnresolvable = !base;
        
        this.getBase = (this.isUnresolvable ?
            error.referenceError(this.name) :
            internal_reference_operations.getValue(this.base));
    });

/**
 * Computation that dereferences the stored value.
 * 
 * Errors if the value cannot be dereferenced.
 */
EnvironmentReference.prototype.getValue = function() {
    var name = this.name,
        strict = this.strict;
    return compute.bind(this.getBase, function(env) {
        return compute.branch(env.hasBinding(name, strict),
            env.getBindingValue(name, strict),
            undef.UNDEFINED);
    });
};

/**
 * Set value stored in this reference.
 * 
 * @param value New value to store.
 */
EnvironmentReference.prototype.setValue = function(value) {
    if (this.isUnresolvable && this.strict)
        return error.referenceError(this.name);
    
    var name = this.name,
        strict = this.strict;
    
    return compute.next(
        compute.bind(
            (this.isUnresolvable ? environment.global : compute.just(this.base)),
            function(env) {
                return environment.setEnvironmentMutableBinding(
                    env,
                    strict,
                    name,
                    value);
            }),
        compute.just(this));
};

/**
 * Delete the value stored for this reference.
 * 
 * Errors if called in strict mode.
 * 
 * Returns whether the operations was successful.
 */
EnvironmentReference.prototype.deleteReference = function() {
    if (this.strict)
        return error.syntaxError();
    
    if (this.isUnresolvable)
        return compute.yes;
    
    return environment.deleteEnvironmentBinding(this.base, this.name);
};

/* Operations
 ******************************************************************************/
/**
 * Create a new environment reference.
 */
var createStrictness = compute.from(EnvironmentReference.create);

/**
 * Create a new environment reference.
 * 
 * Gets the strictness from the current environment.
 */
var create = function(name, base) {
    return compute.bind(
        execution_context.strict,
        function(strict) {
            return createStrictness(name, base, strict);
        });
};

/* Export
 ******************************************************************************/
exports.EnvironmentReference = EnvironmentReference;

exports.createStrictness = createStrictness;
exports.create = create;

});