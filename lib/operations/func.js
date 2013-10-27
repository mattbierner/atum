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
        'atum/value/string',
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
        string_value,
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
    var pushOp = modifyStack(fun.curry(fun.concat, frame));
    
    return compute.binary(getStack, execution_settings.maxStack, function(stack, maxStack) {
        if (stack.length >= maxStack)
            return error.syntaxError(string.create('Maximum call stack size exceeded'));
        return pushOp;
    });
};

/**
 * Construct and push a frame.
 */
var pushFrame = fun.compose(
    push,
    stack_frame.StackFrame.create);

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
var create = function(id, length, f) {
    return object.defineProperties(compute.just(f), {
        'length': property.createValuePropertyFlags(
            new number_value.Number(length)),
        
        'name': property.createValuePropertyFlags(
            (id ? new string_value.String(id) : string_value.EMPTY)),
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
    return forward(callee, thisBinding, args);
};

/**
 * Computation that calls a function.
 * 
 * Errors if `callee` is not callable. Results in the result of the call.
 * 
 * @param callee Reference to object being called.
 * @param thisBinding Reference to the this binding used for the function.
 * @param args Enumeration computation of arguments to call the function with.
 */
var call = function(callee, thisBinding, args) {
    return compute.bind(
        args,
        function(args) {
            return apply(callee, thisBinding, new args2.Args(args));
        });
};

/**
 * 
 */
var functionApply = function(callee, thisBinding, args) {
    return compute.between(pushFrame(callee), pop,
        apply(callee, thisBinding, args));
};

/**
 * Call an external function.
 * 
 * Unlike `call`, this effects the execution context stack and should be used
 * for things like language function calls.
 * 
 * @param callee Computation of the function to call.
 * @param [thisBinding] Computation of the this binding for the call. Defaults to
 *   the current environment's this binding.
 * @param args Enumeration computation of arguments to call the function with.
 */
var functionCall = function(callee, thisBinding, args) {
    return compute.binds(
        compute.enumeration(
            thisBinding || execution_context.thisBinding,
            args),
        function(t, args) {
            return functionApply(callee, t, new args2.Args(args));
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


exports.functionApply = functionApply;
exports.functionCall = functionCall;

});