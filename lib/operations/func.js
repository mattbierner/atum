/**
 * @fileOverview Function computations.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/object',
        'atum/context/execution_context',
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
        'atum/value/value'],
function(exports,
        compute,
        builtin_object,
        exc,
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
 * Construct and push a frame.
 */
var pushFrame = function(name) {
    return push(new stack_frame.StackFrame(name));
};

/**
 * Computation that pops the topmost value from the current stack.
 */
var pop = function() {
    return modifyStack(function(stack) {
        return stack.slice(1);
    });
};

/* Creation
 ******************************************************************************/
/**
 */
var createConstructor = function(id, length, prototype, impl) {
    return compute.bind(impl, function(f) {
        return object.defineProperties(compute.just(f), {
            'length': {
                'value': number.create(length),
                'enumerable': false,
                'writable': false,
                'configurable': false
            },
            'prototype': {
                'value': compute.just(prototype),
                'enumerable': false,
                'writable': false,
                'configurable': true
            }
        });
    });
};

/**
 * Create a hosted function object.
 * 
 * @param {string} id Identifier for the function.
 * @param {number} length Number of arguments the function expects.
 * @param impl Object providing the hosted function's implementation.
 */
var create = function(id, length, impl) {
    return compute.bind(impl, function(f) {
        return object.defineProperties(compute.just(f), {
            'length': {
                'value': number.create(length),
                'enumerable': false,
                'writable': false,
                'configurable': false
            },
            'constructor': {
                'value': compute.just(f),
                'enumerable': false,
                'writable': true,
                'configurable': true
            },
            'prototype': {
                'value': object.construct(builtin_object.Object, []),
                'enumerable': false,
                'writable': true,
                'configurable': true
            }
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

var apply = function(callee, thisBinding, args) {
    return value_reference.dereference(callee, function(func) {
        if (!value.isCallable(func))
            return error.typeError(
                string.concat(
                    string.create("'"),
                    type_conversion.toString(callee),
                    string.create("' is not a function")));
        return compute.between(pushFrame(func.id), pop(),
            func.call(callee, thisBinding, args));
    });
};

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
exports.createConstructor = createConstructor;
exports.create = create;

// Operations
exports.isCallable = isCallable;

exports.apply = apply;
exports.call = call;

});