/**
 * @fileOverview Computations for functions.
 */
define(['atum/compute',
        'atum/operations/execution_context',
        'atum/value/value'],
function(compute,
        execution_context,
        value) {
"use strict";

/**
 * Maximum size of stack
 * 
 * @TODO: Doesn't makes sense to have here, should probably be part of exec ctx.
 */
var MAX_STACK = 1000;

/* Operations
 ******************************************************************************/
var push = function() {
    return execution_context.modifyStack(function(stack) {
        return [null].concat(stack);
    });
};

var pop = function() {
    return execution_context.modifyStack(function(stack) {
        return stack.slice(1);
    });
};

var call = function(callee, impl, thisBinding, args) {
    return compute.binds(
        compute.sequence(
            callee,
            impl,
            thisBinding,
            args),
        function(calleeRef, func, t, args) {
            if (value.type(func) !== 'object' || !value.isCallable(func))
                return compute.error("TypeError");
            return compute.bind(execution_context.getStack(), function(stack) {
                if (stack.length > MAX_STACK)
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
    'call': call
};

});