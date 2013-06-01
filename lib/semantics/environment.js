/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['atum/compute',
        'atum/iref',
        'atum/reference',
        'atum/context/execution_context',
        'atum/context/environment',
        'atum/context/environment_record',
        'atum/semantics/reference',
        'atum/semantics/undef',
        'atum/semantics/execution_context',],
function(compute,
        iref,
        reference,
        execution_context,
        environment,
        environment_record,
        reference_semantics,
        undef,
        execution_context_semantics) {
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
 * 
 */
EnvironmentReference.prototype.getBase = function() {
    return reference.dereference(this.base);
};

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
    return compute.bind(this.getBase(), function(env) {
        return (environment_record.hasBinding(env.record, name, strict) ?
            compute.always(environment_record.getBindingValue(env.record, name, strict)) : 
            undef.create());
    });
};

/**
 * @Todo Use Correct host error type.
 */
EnvironmentReference.prototype.set = function(value) {
    var base = this.base,
        name = this.name,
        strict = this.strict;
    if (!base && strict) {
        return compute.never(new reference.ReferenceError(name));
    }
    return setEnvironmentMutableBinding(
        name,
        strict,
        (base ? compute.always(base) : execution_context_semantics.getGlobal()),
        value);
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
    return (new iref.Iref()).set(compute.always(env));
};

var pushEnvironment = function(f) {
    return compute.bind(getEnvironment(), function(env) {
        return compute.bind((new iref.Iref()).set(compute.always(f(env))), setEnvironment);
    });
};

var popEnvironment = function() {
    return compute.bind(reference_semantics.getValue(getEnvironment()), function(env) {
        return setEnvironment(env.outer);
    });
};

var withEnvironment = function(env, p) {
    return compute.bind(getEnvironment(), function(oldEnv) {
        return compute.next(
            setEnvironment(env),
            compute.then(p,
                setEnvironment(oldEnv)));
    });
};


/**
 * 
 */
var putIdentifierReference = function(ref, name, value) {
    return (!ref ?
        compute.empty :
        compute.bind(
            ref.dereference(),
            function(lex) {
                return ref.set(compute.always(
                    new environment.LexicalEnvironment(
                        lex.outer,
                        environment_record.setMutableBinding(lex.record, name, value))));
            }));
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
        compute.getContext(),
        function(ctx) {
            return getIdentifierReference(ctx.lexicalEnvironment, name);
        });
};

/**
 */
var setEnvironmentMutableBinding = function(name, strict, environment, value) {
    return compute.bind(value, function(x) {
        return compute.bind(environment, function(env) { 
            return compute.next(
                setIdentifierReference(env, name, x, strict),
                compute.always(x));
        });
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
    return setEnvironmentMutableBinding(name, strict, getEnvironment(), value);
};

/**
 * Computation that creates a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var putMutableBinding = function(name, strict, value) {
    return compute.binds(
        compute.sequence(
            value,
            compute.getContext()),
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

    'modifyEnvironment': modifyEnvironment,
    'createEnvironment': createEnvironment,
    
    'getEnvironment': getEnvironment,
    'setEnvironment':setEnvironment,
    'pushEnvironment': pushEnvironment,
    'popEnvironment': popEnvironment,
    'withEnvironment': withEnvironment,
    
    'getBinding': getBinding,
    'setMutableBinding': setMutableBinding,
    'putMutableBinding': putMutableBinding
};

});