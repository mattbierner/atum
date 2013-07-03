/**
 * @fileOverview ECMAScript 5.1 program semantics.
 */
define(['atum/compute',
        'atum/completion',
        'atum/debug/operations',
        'atum/operations/completion',
        'atum/semantics/statement'],
function(compute,
        completion,
        debug_operations,
        completion_semantics,
        statement){
"use strict";

/* Semantics
 ******************************************************************************/
var sourceElement = function(p) {
    return debug_operations.debuggable(p);
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

/* Export
 ******************************************************************************/
return {
    'sourceElements': sourceElements
};

});