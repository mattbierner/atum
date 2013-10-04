/**
 * @fileOverview Function computations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/builtin/object',
        'atum/context/execution_context',
        'atum/context/execution_metadata',
        'atum/context/stack_frame',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/execution_settings',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/number',
        'atum/value/property',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        object_builtin,
        exc,
        execution_metadata,
        stack_frame,
        error,
        execution_context,
        execution_settings,
        number,
        object,
        string,
        type_conversion,
        value_reference,
        args2,
        number_value,
        property,
        value) {
"use strict";

/* Basic Stack Operations
 ******************************************************************************/
/**
 * Computation that gets the stack of the current execution context.
 */
var getStack = execution_context.extract(function(ctx) {
    return ctx.metadata.stack;
});


/**
 * Computation that sets the current execution context stack to `s`
 */
var setStack = function(s) {
    return execution_context.modifyContext(function(ctx) {
        return exc.setMetadata(ctx, execution_metadata.setStack(ctx.metadata, s));
    });
};

/**
 * Computation that modifies the stack of the current execution context
 * with function f.
 * 
 * @param f Function that maps current stack to the new stack.
 */
var modifyStack = function(f) {
    return compute.bind(getStack, fun.compose(setStack, f));
};

/* Stack Operations
 ******************************************************************************/
/**
 * Computation that pushes value `frame` onto the current stack.
 * 
 * Errors if pushing will exceed the maximum stack size.
 */
var push = function(frame) {
    var pushOp = modifyStack(function(stack) {
        return [frame].concat(stack);
    });
    return compute.binary(getStack, execution_settings.maxStack, function(stack, maxStack) {
        if (stack.length >= maxStack)
            return error.syntaxError(string.create('Maximum call stack size exceeded'));
        return pushOp;
    });
};

/**
 * Construct and push a frame.
 */
var pushFrame = function(name) {
    return push(new stack_frame.StackFrame(name));
};

/**
 * Computation that pops the topmost value from the current stack.
 */
var pop = modifyStack(fun.curry(fun.slice, 1, undefined));

/* Creation
 ******************************************************************************/
/**
 * Create a hosted function object.
 * 
 * @param {string} id Identifier for the function.
 * @param {number} length Number of arguments the function expects.
 * @param impl Object providing the hosted function's implementation.
 */
var create = function(id, length, impl) {
    return compute.bind(impl, function(f) {
        return compute.bind(object.construct(object_builtin.Object, []), function(proto) {
            return object.defineProperties(compute.just(f), {
                'length': property.createValuePropertyFlags(
                    new number_value.Number(length)),
                'constructor': property.createValuePropertyFlags(
                    f,
                    property.WRITABLE | property.CONFIGURABLE),
                'prototype': property.createValuePropertyFlags(
                    proto,
                    property.WRITABLE | property.CONFIGURABLE)
            });
        });
    });
};

/* Operations
 ******************************************************************************/
/**
 * Computation of if `callee` is a callable hosted object.
 */
var isCallable = function(callee) {
    return value_reference.dereference(callee, function(obj) {
        return compute.bool(obj && value.isCallable(obj));
    })
};

/**
 * Internal function call.
 * 
 * Does not change stack. Useful when a internal function must forward a new set
 * of arguments to itself without a visible recursive call.
 * 
 * @param callee Reference to function being called.
 * @param thisBinding Reference to this object used for evaluation.
 * @param args Arguments used to call function.
 */
var forward = function(callee, thisBinding, args) {
    return value_reference.dereference(callee, function(func) {
        if (!value.isCallable(func))
            return error.typeError(
                string.concat(
                    string.create("'"),
                    type_conversion.toString(callee),
                    string.create("' is not a function")));
        return func.call(callee, thisBinding, args);
    });
};

/**
 * 
 */
var apply = function(callee, thisBinding, args) {
    return value_reference.dereference(callee, function(func) {
        return compute.between(pushFrame(func.id), pop,
            forward(callee, thisBinding, args));
    });
};

/**
 * Computation that calls a function.
 * 
 * Errors if `callee` is not callable. Results in the result of the call.
 * 
 * @param callee Computation of the function to call.
 * @param [thisBinding] Computation of the this binding for the call. Defaults to
 *   the current environment's this binding.
 * @param args Enumeration computation of arguments to call the function with.
 */
var call = function(callee, thisBinding, args) {
    return compute.binds(
        compute.enumeration(
            callee,
            thisBinding || execution_context.thisBinding,
            args),
        function(func, t, args) {
            return apply(func, t, new args2.Args(args));
        });
};

/* Export
 ******************************************************************************/
// Primitive Stack Operations
exports.getStack = getStack;
exports.modifyStack = modifyStack;
exports.setStack =setStack;

// Stack Operations
exports.push = push;
exports.pop = pop;

// Creation
exports.create = create;

// Operations
exports.isCallable = isCallable;

exports.forward = forward;
exports.apply = apply;
exports.call = call;

});