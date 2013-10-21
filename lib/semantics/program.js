/**
 * @fileOverview ECMAScript 5.1 program semantics.
 */
define(['atum/completion',
        'atum/compute',
        'atum/fun',
        'atum/compute/statement',
        'atum/compute/program',
        'atum/builtin/impl/global',
        'atum/semantics/statement',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/string',
        'atum/operations/undef'],
function(completion,
        compute,
        fun,
        statement,
        program_computations,
        global,
        statement_semantics,
        error,
        execution_context,
        string,
        undef){
"use strict";

var extract = function(x) {
    if (x instanceof completion.Completion) {
        switch (x.type) {
        case completion.NormalCompletion.type: 
            return (x.value === null ? undef.UNDEFINED : program_computations.just(x.value));
        case completion.ReturnCompletion.type:
            return error.syntaxError(string.create("Return statements are only valid inside functions"));
        case completion.BreakCompletion.type:
            return error.syntaxError(string.create("'break' is only valid inside a switch or loop statement"));
        case completion.ContinueCompletion.type:
            return error.syntaxError(string.create("'continue' is only valid inside a loop statement"));
        case completion.ThrowCompletion.type:
            return program_computations.fail(x.value);
        }
    }
    return program_computations.just(x);
};

/* Semantics
 ******************************************************************************/
var sourceElement = function(p) {
    return p;
};

/**
 * Semantics for the body of a program or function.
 * 
 * Evaluates statements in order until a completion is found or no more statements
 * are left.
 * 
 * @param strict Is this block explicitly strict. False may inherit strictness from
 *   current environment if it is strict.
 * @param declarations Array of declarations to evaluate before evaluating any
 *    statements
 * @param statements Array of statement computations to evaluate in order.
 */
var sourceElements = function(strict, declarations, statements) {
    var body = statement.next(
        statement_semantics.statementList(declarations),
        statement_semantics.statementList(fun.map(sourceElement, statements)));
    return (
        (strict ?
            execution_context.withStrict(strict, body) :
            body));
};

/**
 * Semantics for the body of a program.
 * 
 * When body results in a completion, the completion value is extracted.
 */
var programBody = function(body) {
    return program_computations.bind(body, extract);
};

/**
 * Program semantics.
 * 
 * Initializes the execution context and evaluates the body of the program.
 */
var program = function(body) {
    return compute.sequence(
        global.enterGlobal(),
        global.initialize(),
        programBody(body));
};

/* Export
 ******************************************************************************/
return {
    'extract': extract,

    'sourceElements': sourceElements,
    
    'program': program,
    'programBody': programBody
};

});