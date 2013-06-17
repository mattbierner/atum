/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['atum/compute',
        'atum/internal_reference',
        'atum/context/execution_context',
        'atum/context/environment',
        'atum/context/environment_record',
        'atum/operations/iref',
        'atum/operations/undef',
        'atum/operations/execution_context',
        'atum/operations/internal_reference'],
function(compute,
        internal_reference,
        execution_context,
        environment,
        environment_record,
        iref,
        undef,
        execution_context_semantics,
        internal_reference_semantics) {
"use strict";

/* Environment Reference
 ******************************************************************************/
/**
 * Reference type for references to a value in an environment.
 * 
 * @param {String} name Identifier used to lookup referenced value.
 * @param base Reference to the object storing the referenced value. If null,
 *   assumed to be the global object.
 * @param {Boolean} strict Is the reference strict.
 */
var EnvironmentReference = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
};
EnvironmentReference.prototype = new internal_reference.InternalReference;

/**
 * @Todo Use Correct host error type.
 */
EnvironmentReference.prototype.getBase = function() {
    if (!this.base) {
        return compute.error(this.name)
    }
    return internal_reference_semantics.getValue(compute.always(this.base));
};

/**
 * Computation that dereferences this reference or errors if the value cannot
 * be dereferenced.
 * 
 * @Todo Use Correct host error type.
 */
EnvironmentReference.prototype.getValue = function() {
    var name = this.name,
        strict = this.strict;
    return compute.bind(this.getBase(), function(env) {
        return (environment_record.hasBinding(env.record, name, strict) ?
            compute.always(environment_record.getBindingValue(env.record, name, strict)) : 
            undef.create());
    });
};

/**
 * @Todo Use Correct host error type.
 */
EnvironmentReference.prototype.setValue = function(value) {
    var base = this.base,
        name = this.name,
        strict = this.strict;
    if (!base && strict) {
        return compute.error(name);
    }
    return setEnvironmentMutableBinding(
        (base ? compute.always(base) : execution_context_semantics.getGlobal()),
        name,
        strict,
        compute.always(value));
};


/* Environment Reference Operations
 ******************************************************************************/
/**
 * 
 */
var putIdentifierReference = function(ref, name, value) {
    return internal_reference_semantics.modifyValue(ref, function(lex) {
         return new environment.LexicalEnvironment(
            lex.outer,
            environment_record.setMutableBinding(lex.record, name, value))
    });
};

/**
 * 
 */
var setIdentifierReference = function(ref, name, value) {
    return compute.bind(
        internal_reference_semantics.getValue(ref),
        function(lex) {
            return (lex.outer === null || environment_record.hasBinding(lex.record, name) ?
                internal_reference_semantics.setValue(ref, compute.always(environment.putIdentifier(lex, name, value))) :
                setIdentifierReference(compute.always(lex.outer), name, value));
        });
};

/**
 * 
 */
var getIdentifierReference = function(ref, name) {
    return compute.bind(
        internal_reference_semantics.getValue(compute.always(ref)),
        function(lex) {
            if (environment_record.hasBinding(lex.record, name)) {
                return compute.always(new EnvironmentReference(name, ref));
            }
            return (lex.outer ?
                getIdentifierReference(lex.outer, name) :
                compute.always(new EnvironmentReference(name, null)));
        });
};

/* Environment Operations
 ******************************************************************************/
/**
 * Create a computation that gets the binding for 'name' in environment resulting
 * from computation 'environment'.
 * 
 * @param environment Computation that returns reference to environment.
 * @param {String} name Name to lookup.
 */
var getEnvironmentBinding = function(environment, name) {
    return compute.bind(environment, function(lex) {
        return getIdentifierReference(lex, name);
    });
};

/**
 * Create a computation that gets the binding for 'name' in the current environment 
 * 
 * @param {String} name Name to lookup.
 */
var getBinding = function(name) {
    return getEnvironmentBinding(getEnvironment(), name);
};

/**
 * Create computation that sets the value of an existing binding in the environment
 * from 'environment'. Returns result of 'value'.
 * 
 * @param environment Computation that returns reference the environment to set
 *   binding in.
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var setEnvironmentMutableBinding = function(environment, name, strict, value) {
    return compute.bind(value, function(x) {
        return compute.next(
            setIdentifierReference(environment, name, x, strict),
            compute.always(x));
    });
};

/**
 * Create computation that sets the value of an existing binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var setMutableBinding = function(name, strict, value) {
    return setEnvironmentMutableBinding(getEnvironment(), name, strict, value);
};

/**
 * Computation to create a new binding in the environment from 'environment'.
 * 
 * @param environment Computation that returns reference to environment to put
 *   binding in.
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var putEnvironmentMutableBinding = function(environment, name, strict, value) {
    return compute.bind(value, function(x) {
        return compute.next(
            putIdentifierReference(environment, name, x, strict),
            compute.always(x));
    });
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var putMutableBinding = function(name, strict, value) {
    return putEnvironmentMutableBinding(getEnvironment(), name, strict, value);
};

/* Computations
 ******************************************************************************/
var modifyEnvironment = function(f) {
    return compute.modifyContext(function(ctx) {
        return execution_context.setLexicalEnvironment(ctx, f(ctx.lexicalEnvironment));
    });
};

var getEnvironment = function() {
    return compute.bind(compute.getContext(), function(ctx) {
        return compute.always(ctx.lexicalEnvironment);
    });
};

var setEnvironment = function(env) {
    return modifyEnvironment(function() { return env; });
};

var createEnvironment = function(env) {
    return iref.create(compute.always(env));
};

var pushEnvironment = function(f) {
    return compute.bind(getEnvironment(), function(env) {
        return compute.bind(createEnvironment(f(env)), setEnvironment);
    });
};

var withEnvironment = function(env, p) {
    return compute.bind(getEnvironment(), function(oldEnv) {
        return compute.next(
            setEnvironment(env),
            compute.then(
                p,
                setEnvironment(oldEnv)));
    });
};

/* Export
 ******************************************************************************/
return {
    'EnvironmentReference': EnvironmentReference,

    'modifyEnvironment': modifyEnvironment,
    'createEnvironment': createEnvironment,
    
    'getEnvironment': getEnvironment,
    'setEnvironment':setEnvironment,
    'pushEnvironment': pushEnvironment,
    'withEnvironment': withEnvironment,
    
    'getBinding': getBinding,
    'setMutableBinding': setMutableBinding,
    'putEnvironmentMutableBinding': putEnvironmentMutableBinding,
    'putMutableBinding': putMutableBinding
};
});