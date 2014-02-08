/**
 * @fileOverview Language function meta
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/operations/args',
        'atum/operations/environment'],
function(exports,
        compute,
        fun,
        bargs,
        environment){
"use strict";


var bindArguments = function(env, strict, names, args) {
    return compute.map_(function(x, i) {
        return environment.putEnvironmentMutableBinding(env, strict, x, args.getArg(i));
    }, names);
};

var createArgumentsBinding = function(env, fn, strict, names, args) {
    return compute.branch(environment.hasEnvironmentBinding(env, 'arguments'),
        compute.empty,
        compute.bind(
            bargs.create(fn, names, args, env, strict),
            fun.curry(environment.putEnvironmentImmutableBinding, env, strict, 'arguments')));
};

var bindFunctionDeclarations = function(env, strict, declarations) {
    return compute.map_(
        function(x) {
            return compute.branch(environment.hasEnvironmentBinding(env, x[0]),
                compute.branch(environment.isGlobalEnvironment(env),
                    compute.bind(
                        environment.global,
                        function(g) {
                            debugger;
                        }),
                    x[1]));
        },
        declarations[1]);
};

/**
 * Init the variable declaration bindings for a block of code.
 * 
 * @param env Environment being inited.
 * @param strict Is the code strict?
 * @param declaration Array of all variable declarations.
 */
var bindVariableDeclarations = function(env, strict, declarations) {
    return compute.map_(
        function(x) {
            return compute.branch(environment.hasEnvironmentBinding(env, x),
                compute.empty,
                environment.putEnvironmentMutableBinding(env, strict, x))
        },
        declarations[0]);
};

/* Initialization
 ******************************************************************************/
/**
 * Declaration binding initialization for a function.
 * 
 * @param env Environment ref.
 * @param strict Is the function code strict?
 * @param fn Function ref.
 * @param names Array of parameter names.
 * @param args Argument object function was called with.
 */
var initFunction = function(env, strict, fn, id, names, args, declarations) {
    return compute.sequence(
        environment.setEnvironment(env),
        (id ?
            environment.putEnvironmentImmutableBinding(env, strict, id, fn) :
            compute.empty),
        bindArguments(env, strict, names, args),
        bindFunctionDeclarations(env, strict, declarations),
        createArgumentsBinding(env, fn, strict, names, args),
        bindVariableDeclarations(env, strict, declarations));
};

var initEval = function(){/*TODO*/};

/* Export
 ******************************************************************************/
exports.initFunction = initFunction;

exports.initEval = initEval;

});