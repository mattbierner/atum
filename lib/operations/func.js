/**
 * @fileOverview Function computations.
 */
define(['exports',
        'atum/compute',
        'atum/context/execution_context',
        'atum/context/stack_frame',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/execution_settings',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/value/args',
        'atum/value/value'],
function(exports,
        compute,
        exc,
        stack_frame,
        error,
        execution_context,
        execution_settings,
        string,
        type_conversion,
        args2,
        value) {
//"use strict";

/* Basic Stack Operations
 ******************************************************************************/
/**
 * Computation that gets the stack of the current execution context.
 */
var getStack  = function() {
    return execution_context.extract(function(ctx) {
        return ctx.stack;
    });
};

/**
 * Computation that sets the current execution context stack to `s`
 */
var setStack = function(s) {
    return execution_context.modifyContext(function(ctx) {
        return exc.setStack(ctx, s);
    });
};

/**
 * Computation that modifies the stack of the current execution context
 * with function f.
 * 
 * @param f Function that maps current stack to the new stack.
 */
var modifyStack = function(f) {
    return compute.bind(getStack(), function(s) {
        return setStack(f(s));
    });
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
    return compute.binary(getStack(), execution_settings.getMaxStack(), function(stack, maxStack) {
        if (stack.length >= maxStack)
            return compute.error('Maximum call stack size exceeded');
        return pushOp;
    });
};

/**
 * Computation that pops the topmost value from the current stack.
 */
var pop = function() {
    return modifyStack(function(stack) {
        return stack.slice(1);
    });
};

/* Operations
 ******************************************************************************/
var call = function(callee, impl, thisBinding, args) {
    return compute.binds(
        compute.sequence(
            callee,
            impl,
            thisBinding,
            args),
        function(calleeRef, func, t, args) {
            if (!value.isObject(func) || !value.isCallable(func))
                return error.typeError(
                    string.concat(
                        string.create("'"),
                        type_conversion.toString(compute.just(calleeRef)),
                        string.create("' is not a function")));
            var frame = new stack_frame.StackFrame(func.id);
            return compute.between(push(frame), pop(),
                func.call(calleeRef, t, new args2.Args(args)));
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
exports.call = call;

});