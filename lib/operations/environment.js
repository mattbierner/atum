/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/context/environment_reference',
        'atum/context/environment',
        'atum/operations/boolean',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/iref'],
function(exports,
        compute,
        fun,
        environment_reference,
        environment,
        boolean,
        error,
        execution_context,
        internal_reference,
        iref) {
"use strict";

/* Context Operations
 ******************************************************************************/
/**
 * Get the current lexical environment reference.
 */
var getEnvironment = execution_context.extract(function(ctx) {
    return ctx.lexicalEnvironment;
});

/**
 * Get the current variable environment reference.
 */
var getVariableEnvironment = execution_context.extract(function(ctx) {
    return ctx.variableEnvironment;
});

/**
 * Modify the value of the current lexical environment.
 * 
 * @param f Function that maps the current environment reference to the new environment reference.
 */
var modifyEnvironment = function(f) {
    return execution_context.modifyContext(function(ctx) {
        return ctx.setLexicalEnvironment(f(ctx.lexicalEnvironment));
    });
};

/**
 * Set the current lexical environment.
 * 
 * @param env Reference to new environment.
 */
var setEnvironment = fun.compose(
    modifyEnvironment,
    fun.constant);

/**
 * Capture the current environment, perform computation `p`, then restore old environment.
 */
var environmentBlock = function(p) {
    return compute.bind(getEnvironment, function(oldEnv) {
        return compute.thenForce(p, setEnvironment(oldEnv));
    });
};

/**
 * Get the global object.
 */
var global = execution_context.extract(function(ctx) {
    return ctx.global;
});

/**
 * Is `env` the global environment.
 */
var isGlobalEnvironment = function(env) {
    return compute.binary(
        global,
        internal_reference.getValue(env),
        function(g, env) {
            return compute.bool(env.object === g);
        });
};

/* Creation
 ******************************************************************************/
/**
 * Create a new declarative lexical environment.
 * 
 * @param [outer] Reference to outer environment.
 */
var createDeclativeEnvironment = fun.compose(
    iref.create,
    environment.DeclarativeLexicalEnvironment.create);

/**
 * Create a new object lexical environment.
 * 
 * @param obj Reference to the object base for this environment.
 * @param [outer] Reference to outer environment.
 */
var createObjectEnvironment = function(obj, outer) {
    return iref.create(
        environment.ObjectLexicalEnvironment.create(outer, obj, true));
};

/**
 * Create a new object lexical environment using the current environment as its
 * outer.
 */
var createCurrentObjectEnvironment = function(obj) {
    return compute.bind(getEnvironment, function(env) {
        return createObjectEnvironment(obj, env);
    });
};

/* Environment Operations
 ******************************************************************************/
/**
 * Does `env` have a binding for `name`.
 * 
 * This only checks `env`, not its outer environments.
 * 
 * @param environment Reference to environment.
 */
var hasEnvironmentBinding = function(env, name) {
    return internal_reference.dereference(env, function(lex) {
        return lex.hasOwnBinding(name);
    });
};

/**
 * Get the binding for 'name' in `env`
 * 
 * @param environment Reference to environment.
 * @param strict Is the binding strict.
 * @param {String} name Name to lookup.
 */
var getStrictnessEnvironmentBinding = function(env, strict, name) {
    return internal_reference.dereference(env, function(lex, ref) {
        return compute.branch(lex.hasOwnBinding(name), 
            environment_reference.createStrictness(name, ref, strict),
            (lex.outer ?
                getStrictnessEnvironmentBinding(lex.outer, strict, name) :
                environment_reference.createStrictness(name, null, strict)));
    });
};

/**
 * Get the binding for 'name' in environment resulting from computation 'environment'.
 * 
 * @param environment Reference to environment.
 * @param {String} name Name to lookup.
 */
var getEnvironmentBinding = function(env, name) {
    return compute.bind(
        execution_context.strict,
        function(strict) {
            return getStrictnessEnvironmentBinding(env, strict, name);
        });
};

/**
 * Create a computation that gets the binding for 'name' in the current environment 
 * 
 * @param {String} name Name to lookup.
 */
var getBinding = function(name) {
    return compute.bind(getEnvironment, function(env) {
        return getEnvironmentBinding(env, name);
    });
};

/**
 * Set the value of an existing binding in the environment from 'env'.
 * 
 * @param env Reference the environment to set binding in.
 * @param {boolean} strict Is the binding strict.
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var setEnvironmentMutableBinding = function(env, strict, name, value) {
    return internal_reference.dereference(env, function(lex, ref) {
        if (lex.outer === null)
            return lex.setMutableBinding(ref, name, value);
        return compute.branch(lex.hasOwnBinding(name),
            lex.setMutableBinding(ref, name, value),
            setEnvironmentMutableBinding(lex.outer, name, value));
    });
};

/**
 * Create computation that sets the value of an existing binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var setMutableBinding = function(name, value) {
    return compute.binary(
        getEnvironment,
        execution_context.strict,
        function(env, strict) {
            return setEnvironmentMutableBinding(env, strict, name, value);
        });
};

/**
 * Computation to create a new binding in the environment from 'environment'.
 * 
 * @param environment Reference to environment to put binding in.
 * @param {boolean} strict Is the binding strict.
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var putEnvironmentMutableBinding = function(env, strict, name, value) {
    return internal_reference.dereference(env, function(lex, ref) {
        return lex.setMutableBinding(ref, name, value);
    });
};

/**
 * Computation to create a new binding in the current environment with a specific
 * strictness.
 * 
 * @param {boolean} strict Is the binding strict.
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var putStrictnessMutableBinding = function(strict, name, value) {
    return compute.bind(
        getEnvironment,
        function(env) {
            return putEnvironmentMutableBinding(env, strict, name, value);
        });
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var putMutableBinding = function(name, value) {
    return compute.bind(execution_context.strict, function(strict) {
        return putStrictnessMutableBinding(strict, name, value);
    });
};

/**
 * Computation to create a new immutable binding in the environment from 'environment'.
 * 
 * @param env Reference to environment to put binding in.
 * @param {boolean} strict Is the binding strict.
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var putEnvironmentImmutableBinding = function(env, strict, name, value) {
    return internal_reference.dereference(env, function(lex, ref) {
        return lex.putImmutableBinding(ref, name, value);
    });
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {boolean} strict Is the binding strict.
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var putStrictnessImmutableBinding = function(strict, name, value) {
    return compute.bind(
        getEnvironment,
        function(env) {
            return putEnvironmentImmutableBinding(env, strict, name, value);
        })
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Value being bound.
 */
var putImmutableBinding = function(name, value) {
    return compute.bind(
        execution_context.strict,
        function(strict) {
            return putStrictnessImmutableBinding(strict, name, value);
        });
};

/**
 * @param env Reference to environment.
 * @param name Name of binding to delete.
 */
var deleteEnvironmentBinding = function(env, name) {
    return internal_reference.dereference(env, function(lex, ref) {
        if (!lex.outer)
            return lex.deleteBinding(ref, name);
        return compute.branch(lex.hasOwnBinding(name),
            lex.deleteBinding(ref, name),
            deleteEnvironmentBinding(lex.outer, name));
    });
};

/* Export
 ******************************************************************************/
// Context
exports.getEnvironment = getEnvironment;
exports.getVariableEnvironment = getVariableEnvironment;
exports.modifyEnvironment = modifyEnvironment;
exports.setEnvironment = setEnvironment;
exports.environmentBlock = environmentBlock;
exports.global = global;
exports.isGlobalEnvironment = isGlobalEnvironment;

// Creation
exports.createDeclativeEnvironment = createDeclativeEnvironment;
exports.createObjectEnvironment = createObjectEnvironment;
exports.createCurrentObjectEnvironment = createCurrentObjectEnvironment;

// Bindings
exports.hasEnvironmentBinding = hasEnvironmentBinding;

exports.getStrictnessEnvironmentBinding = getStrictnessEnvironmentBinding;
exports.getEnvironmentBinding = getEnvironmentBinding;
exports.getBinding = getBinding;

exports.setEnvironmentMutableBinding = setEnvironmentMutableBinding;
exports.setMutableBinding = setMutableBinding;
exports.putEnvironmentMutableBinding = putEnvironmentMutableBinding;
exports.putStrictnessMutableBinding = putStrictnessMutableBinding;
exports.putMutableBinding = putMutableBinding;

exports.putEnvironmentImmutableBinding = putEnvironmentImmutableBinding;
exports.putStrictnessImmutableBinding = putStrictnessImmutableBinding;
exports.putImmutableBinding = putImmutableBinding

exports.deleteEnvironmentBinding = deleteEnvironmentBinding;

});