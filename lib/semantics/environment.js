/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['atum/compute',
        'atum/reference',
        'atum/context/environment',
        'atum/context/environment_record',
        'atum/semantics/reference'],
function(compute,
        reference,
        environment,
        environment_record,
        reference_semantics) {
//"use strict";

/* Environment Reference
 ******************************************************************************/
/**
 * Reference type for references to values within environments.
 * 
 * @param name String identifier used to lookup referenced value.
 * @param base Reference to the object storing the referenced value. If null,
 *   assumed to be the global object.
 * @param strict Is the reference strict.
 */
var EnvironmentReference = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
    
    this.isUnresolvable = (base === undefined);
};
EnvironmentReference.prototype = new reference.Reference;

/**
 * Computation that dereferences this reference or errors if the value cannot
 * be dereferenced.
 * 
 * @Todo Use Correct host error type.
 */
EnvironmentReference.prototype.dereference = function() {
    if (!this.base) {
        return compute.never(new reference.ReferenceError(this.name));
    }
    
    var name = this.name,
        strict = this.strict;
    return compute.bind(
        this.base.dereference(),
        function(env) {
            return compute.always(environment_record.getBindingValue(env.record, name, strict));
        });
};

/**
 * Computation that sets the st
 * @Todo Use Correct host error type.
 */
EnvironmentReference.prototype.set = function(value) {
    if (!this.base) {
        return (this.isStrict ?
            compute.never(new reference.ReferenceError(this.name)) :
            compute.next(setMutableBinding(this.name, this.isStrict, value), value));
    }
    return setMutableBinding(this.name, this.isStrict, value);
};

/**
 * 
 */
EnvironmentReference.prototype.getBase = function() {
    return this.base.dereference();
};


/* Computations
 ******************************************************************************/
/**
 * 
 */
var putIdentifierReference = function(ref, name, value) {
    if (!ref) {
        return compute.always(null);
    }
    return compute.bind(
        ref.dereference(),
        function(lex) {
            return ref.set(compute.always(new environment.LexicalEnvironment(lex.outer, environment_record.setMutableBinding(lex.record, name, value))));
        });
};

/**
 * 
 */
var setIdentifierReference = function(ref, name, value) {
    return compute.bind(ref.dereference(), function(lex) {
        return (lex.outer === null || environment_record.hasBinding(lex.record, name) ?
            ref.set(compute.always(environment.putIdentifier(lex, name, value))) :
            setIdentifierReference(lex.outer, name, value));
    });
};

/**
 * 
 */
var getIdentifierReference = function(ref, name) {
    return compute.bind(ref.dereference(), function(lex) {
        if (environment_record.hasBinding(lex.record, name)) {
            return compute.always(new EnvironmentReference(name, ref));
        }
        return (lex.outer ?
            getIdentifierReference(lex.outer, name) :
            compute.always(new EnvironmentReference(name, undefined)));
    });
};

/**
 * 
 */
var getBinding = function(name) {
    return compute.bind(
        compute.context,
        function(ctx) {
            return getIdentifierReference(ctx.lexicalEnvironment, name);
        });
};

/**
 * Computation that sets the value of an existing binding.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var setMutableBinding = function(name, strict, value) {
    return compute.binda(
        compute.sequence(
            value,
            compute.context),
        function(v, ctx) {
            return compute.next(
                setIdentifierReference(ctx.lexicalEnvironment, name, v, strict),
                compute.always(v));
        });
};

/**
 * Computation that creates a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var putMutableBinding = function(name, strict, value) {
    return compute.binda(
        compute.sequence(
            value,
            compute.context),
        function(v, ctx) {
            return compute.next(
                putIdentifierReference(ctx.lexicalEnvironment, name, v, strict),
                compute.always(v));
        });
};

/* Export
 ******************************************************************************/
return {
    'EnvironmentReference': EnvironmentReference,

    'getBinding': getBinding,
    'setMutableBinding': setMutableBinding,
    'putMutableBinding': putMutableBinding
};

});