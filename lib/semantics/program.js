/**
 * @fileOverview ECMAScript 5.1 program semantics.
 */
define(['atum/completion',
        'atum/compute',
        'atum/builtin/global',
        'atum/semantics/statement',
        'atum/operations/error',
        'atum/operations/string',
        'atum/operations/undef'],
function(completion,
        compute,
        global,
        statement,
        error,
        string,
        undef){
"use strict";

var extract = function(x) {
    if (x instanceof completion.Completion) {
        switch (x.type) {
        case completion.NormalCompletion.type: 
            return (x.value === null ? undef.create() : compute.just(x.value));
        case completion.ReturnCompletion.type:
            return error.syntaxError(string.create("Return statements are only valid inside functions"));
        case completion.BreakCompletion.type:
            return error.syntaxError(string.create("'break' is only valid inside a switch or loop statement"));
        case completion.ContinueCompletion.type:
            return error.syntaxError(string.create("'continue' is only valid inside a loop statement"));
        case completion.ThrowCompletion.type:
            return compute.error(x.value);
        }
    }
    return compute.just(x);
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
 * @param statements Array of statement computations to evaluate in order.
 * @param [declarations] Array of declarations to evaluate before evaluating any
 *    statements
 */
var sourceElements = function(statements, declarations) {
    statements = statement.statementList(statements.map(sourceElement));
    return (declarations ?
        compute.next(
            compute.sequencea(declarations),
            statements) :
        statements);
};

/**
 * Semantics for the body of a program.
 * 
 * When body results in a completion, the completion value is extracted.
 */
var programBody = function(body) {
    return compute.bind(body, extract);
};

/**
 * Program semantics.
 * 
 * Initializes the execution context and evaluates the body of the program.
 */
var program = function(body) {
    return compute.sequence(
        global.initialize(),
        global.enterGlobal(),
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