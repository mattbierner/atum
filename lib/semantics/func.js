/**
 * @fileOverview Function semantics.
 */
define(['atum/completion',
        'atum/compute',
        'atum/builtin/language_function',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/value_reference',
        'atum/operations/undef'],
function(completion,
        compute,
        language_function,
        environment,
        execution_context,
        value_reference,
        undef){
"use strict";

/* Parts
 ******************************************************************************/
var functionBody = function(body) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.Completion) {
            switch (x.type) {
            case completion.ThrowCompletion.type:
                return compute.error(x.value);
            case completion.NormalCompletion.type:
                return undef.create();
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

/* Functions
 ******************************************************************************/
/**
 * 
 */
var functionExpression =  function(id, params, body) {
    var code = functionBody(body);
    return compute.Computation('Function',
        compute.bind(environment.getEnvironment(), function(scope) {
            return compute.bind(execution_context.getStrict(), function(strict) {
                return value_reference.create(
                    language_function.create(scope, id, params, code, strict));
                });
        }));
};

/* Export
 ******************************************************************************/
return {
    'functionExpression': functionExpression
};

});