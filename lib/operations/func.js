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
        'atum/operations/value_reference',
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
        value_reference,
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

/* Calling Operations
 ******************************************************************************/
/**
 * Computation that calls a function function.
 * 
 * Errors if `callee` is not callable. Results in the result of the call.
 * 
 * @param callee Computation of the function to call.
 * @param thisBinding Computation of the this binding for the call.
 * @param args Enumeration computation of arguments to call the function with.
 */
var call = function(callee, thisBinding, args) {
    return compute.bind(callee, function(calleeRef) {
         return compute.binds(
             compute.enumeration(
                value_reference.getValue(compute.just(calleeRef)),
                thisBinding,
                args),
            function(func, t, args) {
                if (!value.isCallable(func))
                    return error.typeError(
                        string.concat(
                            string.create("'"),
                            type_conversion.toString(compute.just(calleeRef)),
                            string.create("' is not a function")));
                var frame = new stack_frame.StackFrame(func.id);
                return compute.between(push(frame), pop(),
                    func.call(calleeRef, t, new args2.Args(args)));
            });
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

// Calling Operations
exports.call = call;

});