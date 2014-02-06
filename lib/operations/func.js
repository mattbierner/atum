/**
 * @fileOverview Function and stack operations.
 */
define(['exports',
        'atum/compute',
        'atum/fun',
        'atum/context/stack_frame',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/execution_settings',
        'atum/operations/value_reference',
        'atum/value/args',
        'atum/value/value'],
function(exports,
        compute,
        fun,
        stack_frame,
        environment,
        error,
        execution_context,
        execution_settings,
        value_reference,
        args_value,
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
        return ctx.setMetadata(ctx.metadata.setStack(s));
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
    var pushOp = modifyStack(fun.curry(fun.concat, frame));
    
    return compute.binary(getStack, execution_settings.maxStack, function(stack, maxStack) {
        if (stack.length >= maxStack)
            return error.syntaxError('Maximum call stack size exceeded');
        return pushOp;
    });
};

/**
 * Construct and push a frame.
 */
var pushFrame = fun.composen(
    push,
    stack_frame.StackFrame.create);

/**
 * Computation that pops the topmost value from the current stack.
 */
var pop = modifyStack(fun.curry(fun.slice, 1, undefined));

/* Basic Operations
 ******************************************************************************/
/**
 * Computation of if `callee` is a callable hosted object.
 */
var isCallable = function(callee) {
    return value_reference.dereference(callee, function(obj) {
        return compute.bool(obj && value.isCallable(obj));
    })
};

/* Calling
 * 
 * Does not change stack. Useful when a internal function must forward a new set
 * of arguments to itself without a visible recursive call.
 ******************************************************************************/
/**
 * Internal Function call using an arguments value.
 * 
 * @param callee Reference to function to call.
 * @param thisBinding Reference to this object used for evaluation.
 * @param args Arguments used to call function.
 */
var forward = function(callee, thisBinding, args) {
    return value_reference.dereference(callee, function(func) {
        if (!value.isCallable(func))
            return error.typeError("'", compute.just(callee), "' is not a function");
        return func.call(callee, thisBinding, args);
    });
};

/**
 * Internal function call with arguments from array.
 * 
 * @see functionForward
 * @param args Array of arguments.
 */
var apply = function(callee, thisBinding, a) {
    return forward(
        callee,
        thisBinding,
        args_value.Args.create(a));
};

/**
 * Computation that calls a function.
 * 
 * @param callee Reference to function to call.
 * @param thisBinding This binding for the call.
 * @param args Computation giving array of arguments.
 */
var call = function(callee, thisBinding, args) {
    return compute.bind(args, function(args) {
        return apply(callee, thisBinding, args);
    });
};

/* Function calls
 * 
 * Unlike `call`, these effect the execution context stack and should be used
 * for things like language function calls.
 ******************************************************************************/
/**
 * Function call using an arguments value.
 * 
 * @see forward
 */
var functionForward = function(callee, thisBinding, args) {
    return compute.bind(compute.newPrompt, function(p) {
        var push = compute.binds(
            compute.enumeration(
                environment.getEnvironment,
                execution_context.loc),
            function(env, loc) {
                return pushFrame(p, callee, args, env, loc);
            });
        
        return compute.betweenForce(push, pop,
            compute.pushPrompt(p,
                forward(callee, thisBinding, args)));
    });
};

/**
 * Function call with arguments from array.
 * 
 * @see apply
 */
var functionApply = function(callee, thisBinding, args) {
    return functionForward(
        callee,
        thisBinding,
        args_value.Args.create(args));
};

/**
 * Function call with arguments from computation.
 *
 * @see call
 */
var functionCall = function(callee, thisBinding, args) {
    return compute.bind(args, function(a) {
        return functionApply(callee, thisBinding, a);
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

// Operations
exports.isCallable = isCallable;

exports.forward = forward;
exports.apply = apply;
exports.call = call;

exports.functionForward = functionForward;
exports.functionApply = functionApply;
exports.functionCall = functionCall;

});