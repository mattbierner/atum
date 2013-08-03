/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['exports',
        'atum/compute',
        'atum/internal_reference',
        'atum/context/execution_context',
        'atum/context/environment',
        'atum/context/environment_record',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/iref',
        'atum/operations/string',
        'atum/operations/undef',],
function(exports,
        compute,
        internal_reference,
        execution_context,
        environment,
        environment_record,
        error,
        execution_context_semantics,
        internal_reference_semantics,
        iref,
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
            undef.create());
    });
};

/**
 * Computation that sets the value stored in this reference.
 */
EnvironmentReference.prototype.setValue = function(value) {
    if (!this.base && this.strict)
        return error.referenceError(string.create(this.name));
    return setEnvironmentMutableBinding(
        (this.base ? compute.just(this.base) : getGlobal()),
        this.name,
        this.strict,
        compute.just(value));
};

/* Creation
 ******************************************************************************/
/**
 * Create a new declarative lexical environment.
 * 
 * @param [outer] Reference to outer environment.
 */
var createDeclativeEnvironment = function(outer) {
    return iref.create(compute.just(new environment.DeclarativeLexicalEnvironment(outer)));
};

/**
 * Create a new object lexical environment.
 * 
 * @param [outer] Reference to outer environment.
 */
var createObjectEnvironment = function(outer) {
    return iref.create(compute.just(new environment.ObjectLexicalEnvironment(outer)));
};

/* Environment Reference Operations
 ******************************************************************************/
/**
 * 
 */
var putMutableIdentifierReference = function(env, name, value) {
    return internal_reference_semantics.modifyValue(env, function(lex) {
         return new environment.LexicalEnvironment(
            lex.outer,
            environment_record.setMutableBinding(lex.record, name, value));
    });
};

/**
 * 
 */
var putImmutableIdentifierReference = function(env, name, value) {
    return internal_reference_semantics.modifyValue(env, function(lex) {
        return new environment.LexicalEnvironment(
            lex.outer,
            environment_record.putImmutableBinding(lex.record, name, value));
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
                internal_reference_semantics.setValue(ref, compute.just(environment.putIdentifier(lex, name, value))) :
                setIdentifierReference(compute.just(lex.outer), name, value));
        });
};

/**
 * 
 */
var getIdentifierReference = function(ref, name) {
    return compute.bind(
        internal_reference_semantics.getValue(compute.just(ref)),
        function(lex) {
            if (environment_record.hasBinding(lex.record, name)) {
                return compute.just(new EnvironmentReference(name, ref));
            }
            return (lex.outer ?
                getIdentifierReference(lex.outer, name) :
                compute.just(new EnvironmentReference(name, null)));
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
            compute.just(x));
    });
};

/**
 * Create computation that sets the value of an existing binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Computation that returns value being bound.
 */
var setMutableBinding = function(name, value) {
    return compute.bind(execution_context_semantics.getStrict(), function(strict) {
        return setEnvironmentMutableBinding(getEnvironment(), name, strict, value);
    });
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
            putMutableIdentifierReference(environment, name, x, strict),
            compute.just(x));
    });
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Computation that returns value being bound.
 */
var putMutableBinding = function(name, value) {
    return compute.bind(execution_context_semantics.getStrict(), function(strict) {
        return putEnvironmentMutableBinding(getEnvironment(), name, strict, value);
    });
};

/**
 * Computation to create a new immutable binding in the environment from 'environment'.
 * 
 * @param environment Computation that returns reference to environment to put
 *   binding in.
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var putEnvironmentImmutableBinding = function(environment, name, strict, value) {
    return compute.bind(value, function(x) {
        return compute.next(
            putImmutableIdentifierReference(environment, name, x, strict),
            compute.just(x));
    });
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Computation that returns value being bound.
 */
var putImmutableBinding = function(name, value) {
    return compute.bind(execution_context_semantics.getStrict(), function(strict) {
        return putEnvironmentMutableBinding(getEnvironment(), name, strict, value);
    });
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
        return compute.just(ctx.lexicalEnvironment);
    });
};

var setEnvironment = function(env) {
    return modifyEnvironment(function() { return env; });
};

var pushEnvironment = function(f) {
    return compute.bind(getEnvironment(), function(env) {
        return compute.bind(createEnvironment(f(env)), setEnvironment);
    });
};

var withEnvironment = function(env, p) {
    return compute.bind(getEnvironment(), function(oldEnv) {
        return compute.between(compute.bind(env, setEnvironment), setEnvironment(oldEnv),
            p);
    });
};

/**
 * Computation that gets the global object.
 */
var getGlobal = function() {
    return execution_context_semantics.extract(function(ctx) {
        return ctx.global;
    });
};

/* Export
 ******************************************************************************/
// EnvironmentReference
exports.EnvironmentReference = EnvironmentReference;

// Creation
exports.createDeclativeEnvironment = createDeclativeEnvironment;
exports.createObjectEnvironment = createObjectEnvironment;

//
exports.modifyEnvironment = modifyEnvironment;

exports.getEnvironment = getEnvironment;
exports.setEnvironment = setEnvironment;
exports.pushEnvironment = pushEnvironment;
exports.withEnvironment = withEnvironment;
exports.getGlobal = getGlobal;

exports.getBinding = getBinding;
exports.setMutableBinding = setMutableBinding;
exports.putEnvironmentMutableBinding = putEnvironmentMutableBinding;
exports.putMutableBinding = putMutableBinding;
exports.putEnvironmentImmutableBinding = putEnvironmentImmutableBinding;
exports.putImmutableBinding = putImmutableBinding

});