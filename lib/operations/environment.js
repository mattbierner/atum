/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['exports',
        'atum/compute',
        'atum/environment_reference',
        'atum/context/execution_context',
        'atum/context/environment',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/iref'],
function(exports,
        compute,
        environment_reference,
        execution_context,
        environment,
        boolean,
        error,
        execution_context_operations,
        internal_reference,
        iref) {
"use strict";

/* Context Operations
 ******************************************************************************/
/**
 * Get the current lexical environment reference.
 */
var getEnvironment = execution_context_operations.extract(function(ctx) {
    return ctx.lexicalEnvironment;
});

/**
 * Modify the value of the current lexical environment.
 * 
 * @param f Function that maps the current environment reference to the new environment reference.
 */
var modifyEnvironment = function(f) {
    return execution_context_operations.modifyContext(function(ctx) {
        return execution_context.setLexicalEnvironment(ctx, f(ctx.lexicalEnvironment));
    });
};

/**
 * Set the current lexical environment.
 * 
 * @param env Reference to new environment.
 */
var setEnvironment = function(env) {
    return modifyEnvironment(function() { return env; });
};

/**
 * Perform computation `p` in the environment resulting from `env`.
 * 
 * Pushes the resulting environment from `env`, evalutes `p`, and restores the
 * old environment,
 */
var withEnvironment = function(env, p) {
    return compute.bind(getEnvironment, function(oldEnv) {
        return compute.between(compute.bind(env, setEnvironment), setEnvironment(oldEnv),
            p);
    });
};

/**
 * Get the global object.
 */
var global = execution_context_operations.extract(function(ctx) {
    return ctx.global;
});

/* Creation
 ******************************************************************************/
/**
 * Create a new declarative lexical environment.
 * 
 * @param [outer] Reference to outer environment.
 */
var createDeclativeEnvironment = function(outer) {
    return iref.create(
        new environment.DeclarativeLexicalEnvironment(outer));
};

/**
 * Create a new object lexical environment.
 * 
 * @param [outer] Reference to outer environment.
 */
var createObjectEnvironment = function(outer, obj) {
    return iref.create(
        new environment.ObjectLexicalEnvironment(outer, obj, true));
};

/* Internal Environment Reference Operations
 ******************************************************************************/
/**
 * 
 */
var putMutableIdentifierReference = function(env, name, value) {
    return internal_reference.dereferenceFrom(env, function(lex, ref) {
        return lex.setMutableBinding(ref, name, value);
    });
};

/**
 * 
 */
var putImmutableIdentifierReference = function(env, name, value) {
    return internal_reference.dereferenceFrom(env, function(lex, ref) {
        return lex.putImmutableBinding(ref, name, value);
    });
};

/**
 * 
 */
var setIdentifierReference = function(env, name, value) {
    return internal_reference.dereferenceFrom(env, function(lex, ref) {
        if (lex.outer === null)
            return lex.setMutableBinding(ref, name, value);
        return compute.branch(lex.hasBinding(name),
            lex.setMutableBinding(ref, name, value),
            setIdentifierReference(compute.just(lex.outer), name, value));
    });
};

/**
 * 
 */
var getIdentifierReference = function(ref, name, strict) {
    return internal_reference.dereference(ref, function(lex) {
        return compute.branch(lex.hasBinding(name), 
            compute.just(new environment_reference.EnvironmentReference(name, ref, strict)),
            (lex.outer ?
                getIdentifierReference(lex.outer, name) :
                compute.just(new environment_reference.EnvironmentReference(name, null, strict))));
    });
};

/**
 * 
 */
var deleteIdentifierReference = function(ref, name) {
    return internal_reference.dereference(ref, function(lex) {
        if (!lex.outer)
            return lex.deleteBinding(ref, name);
        return compute.branch(lex.hasBinding(name),
            lex.deleteBinding(ref, name),
            deleteIdentifierReference(lex.outer, name));
    });
};

/* Environment Operations
 ******************************************************************************/
/**
 * Get the binding for 'name' in environment resulting from computation 'environment'.
 * 
 * @param environment Computation that returns reference to environment.
 * @param {String} name Name to lookup.
 */
var getEnvironmentBinding = function(environment, name) {
    return compute.binary(
        execution_context_operations.strict,
        environment,
        function(strict, lex) {
            return getIdentifierReference(lex, name, strict);
        });
};

/**
 * Create a computation that gets the binding for 'name' in the current environment 
 * 
 * @param {String} name Name to lookup.
 */
var getBinding = function(name) {
    return getEnvironmentBinding(getEnvironment, name);
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
    return compute.bind(execution_context_operations.strict, function(strict) {
        return setEnvironmentMutableBinding(getEnvironment, name, strict, value);
    });
};

/**
 * Computation to create a new binding in the environment from 'environment'.
 * 
 * @param environment Computation that returns reference to environment to put
 *   binding in.
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation of value being bound.
 */
var putEnvironmentMutableBinding = function(environment, name, strict, value) {
    return compute.bind(value, function(x) {
        return compute.next(
            putMutableIdentifierReference(environment, name, x, strict),
            compute.just(x));
    });
};

/**
 * Computation to create a new binding in the current environment with a specific
 * strictness.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation of value being bound.
 */
var putStrictnessMutableBinding = function(name, strict, value) {
    return putEnvironmentMutableBinding(getEnvironment, name, strict, value);
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Computation that returns value being bound.
 */
var putMutableBinding = function(name, value) {
    return compute.bind(execution_context_operations.strict, function(strict) {
        return putStrictnessMutableBinding(name, strict, value);
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
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var putStrictnessImmutableBinding = function(name, strict, value) {
    return putEnvironmentMutableBinding(getEnvironment, name, strict, value);
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Computation that returns value being bound.
 */
var putImmutableBinding = function(name, value) {
    return compute.bind(execution_context_operations.strict, function(strict) {
        return putStrictnessImmutableBinding(name, strict, value);
    });
};

/**
 * 
 */
var deleteEnvironmentBinding = function(environment, name) {
    return deleteIdentifierReference(environment, name);
};

/* Export
 ******************************************************************************/
// Context
exports.getEnvironment = getEnvironment;
exports.modifyEnvironment = modifyEnvironment;
exports.setEnvironment = setEnvironment;
exports.withEnvironment = withEnvironment;
exports.global = global;

// Creation
exports.createDeclativeEnvironment = createDeclativeEnvironment;
exports.createObjectEnvironment = createObjectEnvironment;

// Bindings
exports.getBinding = getBinding;
exports.setEnvironmentMutableBinding = setEnvironmentMutableBinding;
exports.setMutableBinding = setMutableBinding;
exports.putEnvironmentMutableBinding = putEnvironmentMutableBinding;
exports.putStrictnessMutableBinding = putStrictnessMutableBinding;
exports.putMutableBinding = putMutableBinding;

exports.putEnvironmentImmutableBinding = putEnvironmentImmutableBinding;
exports.putImmutableBinding = putImmutableBinding
exports.putStrictnessImmutableBinding = putStrictnessImmutableBinding;

exports.deleteEnvironmentBinding = deleteEnvironmentBinding;

});