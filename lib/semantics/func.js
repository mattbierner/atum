/**
 * @fileOverview Function semantics.
 */
define(['exports',
        'atum/completion',
        'atum/compute',
        'atum/compute/program',
        'atum/builtin/operations/language_function',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/operations/undef'],
function(exports,
        completion,
        compute,
        program,
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
    return program.bindStatement(body, function(x) {
        if (x instanceof completion.Completion) {
            switch (x.type) {
            case completion.ThrowCompletion.type:
                return compute.error(x.value);
            
            case completion.NormalCompletion.type:
                return undef.UNDEFINED;
            
            case completion.ReturnCompletion.type:
                return compute.just(x.value);
            
            case completion.BreakCompletion.type:
                return error.syntaxError("'break' is only valid inside a switch or loop statement");
            
            case completion.ContinueCompletion.type:
                return error.syntaxError("'continue' is only valid inside a loop statement");
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
 * @param strict Is the body of the function strict. The resulting function may
 *  still be strict even if the body is not explicitly strict but it is contained
 *  in strict code.
 */
var fun =  function(id, strict, params, code, declarations, body) {
    return compute.binds(
        compute.enumeration(
            environment.getEnvironment,
            execution_context.strict),
        function(scope, contextStrict) {
            return language_function.create(
                scope,
                (contextStrict || strict),
                id,
                params,
                code,
                declarations,
                functionBody(body));
        });
};

/* Export
 ******************************************************************************/
exports.functionBody = functionBody;

exports.fun = fun;

});