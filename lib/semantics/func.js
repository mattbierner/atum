/**
 * @fileOverview Function semantics.
 */
define(['atum/completion',
        'atum/compute',
        'atum/builtin/language_function',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/operations/undef'],
function(completion,
        compute,
        language_function,
        environment,
        execution_context,
        func,
        object,
        value_reference,
        undef){
"use strict";

/* Parts
 ******************************************************************************/
/**
 * Create computation of a function body for a hosted language function
 * 
 * Maps the completion result of `body` to an expression type result.
 * 
 * @param body Statement type computation of the function's body.
 */
var functionBody = function(body) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.Completion) {
            switch (x.type) {
            case completion.ThrowCompletion.type:
                return compute.error(x.value);
            case completion.NormalCompletion.type:
                return undef.UNDEFINED;
            case completion.ReturnCompletion.type:
                return compute.just(x.value);
            case completion.BreakCompletion.type:
                return error.syntaxError(string.create("'break' is only valid inside a switch or loop statement"));
            case completion.ContinueCompletion.type:
                return error.syntaxError(string.create("'continue' is only valid inside a loop statement"));
            }
        }
        return compute.just(x);
    });
};

/* Function Semantics
 ******************************************************************************/
/**
 * Function
 * 
 * Creates a new hosted language function instance.
 * 
 * @param {string} id Identifier for the function object.
 * @param params Array of names for the parameters the function accepts.
 * @param body Computation of the body of the function.
 */
var fun =  function(id, params, body) {
    var code = functionBody(body);
    return compute.Computation('Function',
        compute.binds(
            compute.enumeration(
                environment.getEnvironment(),
                execution_context.getStrict()),
            function(scope, strict) {
                return func.create(
                    id,
                    params.length,
                    value_reference.create(
                        language_function.create(scope, id, params, code, strict)));
            }));
};

/* Export
 ******************************************************************************/
return {
    'fun': fun
};

});