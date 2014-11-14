/**
 * @fileOverview ECMAScript 5.1 program semantics.
 */
define(['exports',
        'atum/completion',
        'atum/compute',
        'atum/fun',
        'atum/compute/statement',
        'atum/compute/program',
        'atum/builtin/impl/global',
        'atum/builtin/operations/global',
        'atum/semantics/statement',
        'atum/operations/declaration_binding',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/undef'],
function(exports,
        completion,
        compute,
        fun,
        statement,
        program_computations,
        global,
        global_ops,
        statement_semantics,
        declaration_binding,
        environment,
        error,
        execution_context,
        undef){
"use strict";

var extract = function(x) {
    if (x instanceof completion.Completion) {
        switch (x.type) {
        case completion.NormalCompletion.type: 
            return (x.value === null ? undef.UNDEFINED : compute.just(x.value));
        
        case completion.ReturnCompletion.type:
            return error.syntaxError("Return statements are only valid inside functions");
        
        case completion.BreakCompletion.type:
            return error.syntaxError("'break' is only valid inside a switch or loop statement");
        
        case completion.ContinueCompletion.type:
            return error.syntaxError("'continue' is only valid inside a loop statement");
        
        case completion.ThrowCompletion.type:
            return compute.error(x.value);
        }
    }
    return compute.just(x);
};

/* Semantics
 ******************************************************************************/
var sourceElementsDeclarations = fun.compose(
    statement_semantics.statementList,
    fun.curry(fun.map, statement.liftExpression));

var sourceElementsStatements = statement_semantics.statementList;

var sourceBody = function(strict, body) {
    return (strict ?
        execution_context.withStrict(strict, body) :
        body);
};

/**
 * Semantics for the body of a program or function.
 * 
 * Evaluates statements in order until a completion is found or no more statements
 * are left.
 * 
 * @param strict Is this block explicitly strict. False inherits strictness from
 *   current environment.
 * @param declarations Array of declarations to evaluate before evaluating any
 *    statements.
 * @param statements Array of statement computations to evaluate in order.
 */
var sourceElements = function(strict, declarations, statements) {
    return sourceBody(
        strict,
        statement.next(
            statement.liftExpression(
                compute.bind(
                    environment.getEnvironment,
                    function(env) {
                        return declaration_binding.initGlobal(env, strict, declarations);
                    })),
            sourceElementsStatements(statements)));
};

/**
 * Semantics for the body of a program.
 * 
 * When body results in a completion, the completion value is extracted.
 */
var programBody = function(body) {
    return program_computations.bindStatement(body, extract);
};

/**
 * Program semantics.
 * 
 * Initializes the execution context and evaluates the body of the program.
 */
var program = function(body) {
    return compute.sequence(
        global.initialize(),
        global_ops.enterGlobal(),
        programBody(body));
};

/* Export
 ******************************************************************************/
exports.extract = extract;

exports.sourceBody = sourceBody;
exports.sourceElements = sourceElements;

exports.program = program;
exports.programBody = programBody;

});