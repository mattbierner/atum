/**
 * @fileOverview Function semantics.
 */
define(['atum/completion',
        'atum/compute',
        'atum/builtin/language_function',
        'atum/builtin/object',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/number',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/operations/undef'],
function(completion,
        compute,
        language_function,
        builtin_object,
        environment,
        execution_context,
        number,
        object,
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
 * 
 */
var functionExpression =  function(id, params, body) {
    var code = functionBody(body);
    return compute.Computation('Function',
        compute.binds(
            compute.enumeration(
                environment.getEnvironment(),
                execution_context.getStrict()),
            function(scope, strict) {
                return compute.bind(
                    value_reference.create(
                        language_function.create(scope, id, params, code, strict)),
                    function(f){
                        return object.defineProperties(compute.just(f), {
                            'length': {
                                'value': number.create(params.length),
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
                                'value': object.construct(compute.just(builtin_object.Object), compute.enumeration()),
                                'enumerable': false,
                                'writable': true,
                                'configurable': true
                            }
                        });
                    });
            }));
};

/* Export
 ******************************************************************************/
return {
    'functionExpression': functionExpression
};

});