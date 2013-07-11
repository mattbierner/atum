/**
 * @fileOverview ECMAScript 5.1 program semantics.
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

var functionBody = function(body) {
    return compute.bind(body, function(x) {
        if (x instanceof completion.Completion) {
            switch (x.type) {
            case completion.NormalCompletion.type:
                return undef.create();
            case completion.ReturnCompletion.type:
                return compute.just(x.value);
            case completion.BreakCompletion.type:
                return compute.error("Break not in loop");
            case completion.ContinueCompletion.type:
                return compute.error("Continue not in loop");
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
                    new language_function.LanguageFunction(scope, id, params, code, strict));
                });
        }));
};

/* Export
 ******************************************************************************/
return {
    'functionExpression': functionExpression
};

});