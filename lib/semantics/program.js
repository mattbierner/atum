/**
 * @fileOverview ECMAScript 5.1 program semantics.
 */
define(['atum/completion',
        'atum/compute',
        'atum/builtin/global',
        'atum/semantics/statement',
        'atum/operations/undef'],
function(completion,
        compute,
        global,
        statement,
        undef){
"use strict";

var extract = function(x) {
    if (x instanceof completion.Completion) {
        switch (x.type) {
        case completion.NormalCompletion.type: 
            return (x.value === null ? undef.create() : compute.just(x.value));
        case completion.ReturnCompletion.type:
            return compute.error("Return not in function");
        case completion.BreakCompletion.type:
            return compute.error("Break not in loop");
        case completion.ContinueCompletion.type:
            return compute.error("Continue not in loop");
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
            compute.sequence.apply(undefined, declarations),
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
    return compute.next(
        global.initialize(),
        compute.next(
            global.enterGlobal(),
            programBody(body)));
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