/**
 * @fileOverview Computations for functions.
 */
define(['atum/compute',
        'atum/context/execution_context',
        'atum/operations/execution_context',
        'atum/operations/execution_settings',
        'atum/value/type',
        'atum/value/value'],
function(compute,
        exc,
        execution_context,
        execution_settings,
        type,
        value) {
"use strict";

/* Primitive stack Operations
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
 * Computation that modifies the stack of the current execution context
 * with function f.
 * 
 * @param f Function that maps current stack to the new stack.
 */
var modifyStack = function(f) {
    return compute.bind(getStack(), function(s){
        return execution_context.modifyContext(function(ctx) {
            return exc.setStack(ctx, f(s));
        });
    });
};

var setStack = function(s) {
    return modifyStack(function() { return s; });
};


/* Stack Operations
 ******************************************************************************/
var push = function() {
    return modifyStack(function(stack) {
        return [null].concat(stack);
    });
};

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
            if (value.type(func) !== type.OBJECT_TYPE || !value.isCallable(func))
                return compute.error("TypeError");
            return compute.binary(getStack(), execution_settings.getMaxStack(), function(stack, maxStack) {
                if (stack.length >= maxStack)
                    return compute.error('Maximum call stack size exceeded');
                return compute.next(
                    push(),
                    compute.then(
                        func.call(calleeRef, t, args),
                        pop()));
            });
        });
};

/* Export
 ******************************************************************************/
return {
// Primitive Stack Operations
    'getStack': getStack,
    'modifyStack': modifyStack,
    'setStack': setStack,
    
// Stack Operations
    'push': push,
    'pop': pop,

// Operations
    'call': call
};

});