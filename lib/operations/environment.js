/**
 * @fileOverview Computations for querying and mutating the environment.
 */
define(['exports',
        'atum/compute',
        'atum/context/execution_context',
        'atum/context/environment',
        'atum/context/environment_record',
        'atum/operations/boolean',
        'atum/operations/environment_reference',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/iref'],
function(exports,
        compute,
        execution_context,
        environment,
        environment_record,
        boolean,
        environment_reference,
        error,
        execution_context_operations,
        internal_reference,
        iref) {
"use strict";

/* Creation
 ******************************************************************************/
/**
 * Create a new declarative lexical environment.
 * 
 * @param [outer] Reference to outer environment.
 */
var createDeclativeEnvironment = function(outer) {
    return compute.bind(outer, function(outer) {
        return iref.create(compute.just(new environment.DeclarativeLexicalEnvironment(outer)));
    });
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
    return internal_reference.modifyValue(env, function(lex) {
         return new environment.LexicalEnvironment(
            lex.outer,
            environment_record.setMutableBinding(lex.record, name, value));
    });
};

/**
 * 
 */
var putImmutableIdentifierReference = function(env, name, value) {
    return internal_reference.modifyValue(env, function(lex) {
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
        internal_reference.getValue(ref),
        function(lex) {
            return (lex.outer === null || environment_record.hasBinding(lex.record, name) ?
                internal_reference.setValue(ref, compute.just(environment.putIdentifier(lex, name, value))) :
                setIdentifierReference(compute.just(lex.outer), name, value));
        });
};

/**
 * 
 */
var getIdentifierReference = function(ref, name) {
    return compute.bind(
        internal_reference.getValue(compute.just(ref)),
        function(lex) {
            if (environment_record.hasBinding(lex.record, name))
                return compute.just(new environment_reference.EnvironmentReference(name, ref));
            
            return (lex.outer ?
                getIdentifierReference(lex.outer, name) :
                compute.just(new environment_reference.EnvironmentReference(name, null)));
        });
};

/**
 * 
 */
var deleteIdentifierReference = function(ref, name) {
    return compute.bind(
        internal_reference.getValue(ref),
        function(lex) {
            return (lex.outer === null || environment_record.hasBinding(lex.record, name) ?
                compute.next(
                    internal_reference.setValue(ref, compute.just(environment.deleteIdentifier(lex, name))),
                    boolean.TRUE) :
                deleteIdentifierReference(compute.just(lex.outer), name));
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
    return compute.bind(execution_context_operations.getStrict(), function(strict) {
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
    return putEnvironmentMutableBinding(getEnvironment(), name, strict, value);
};

/**
 * Computation to create a new binding in the current environment.
 * 
 * @param {string} name Identifier being bound.
 * @param value Computation that returns value being bound.
 */
var putMutableBinding = function(name, value) {
    return compute.bind(execution_context_operations.getStrict(), function(strict) {
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
 * @param value Computation that returns value being bound.
 */
var putImmutableBinding = function(name, value) {
    return compute.bind(execution_context_operations.getStrict(), function(strict) {
        return putEnvironmentMutableBinding(getEnvironment(), name, strict, value);
    });
};

/**
 * 
 */
var deleteEnvironmentBinding = function(environment, name) {
    return deleteIdentifierReference(environment, name);
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
    return execution_context_operations.extract(function(ctx) {
        return ctx.global;
    });
};

/* Export
 ******************************************************************************/
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
exports.setEnvironmentMutableBinding = setEnvironmentMutableBinding;
exports.setMutableBinding = setMutableBinding;
exports.putEnvironmentMutableBinding = putEnvironmentMutableBinding;
exports.putStrictnessMutableBinding = putStrictnessMutableBinding;
exports.putMutableBinding = putMutableBinding;

exports.putEnvironmentImmutableBinding = putEnvironmentImmutableBinding;
exports.putImmutableBinding = putImmutableBinding

exports.deleteEnvironmentBinding = deleteEnvironmentBinding;

});