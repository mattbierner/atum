/**
 * @fileOverview Declaration semantics.
 */
define(['atum/compute',
        'atum/debug/operations',
        'atum/operations/complete',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/string',
        'atum/operations/undef',
        'atum/semantics/func',
        'atum/semantics/statement'],
function(compute,
        debug,
        complete,
        environment,
        error,
        execution_context,
        internal_reference,
        string,
        undef,
        func,
        statement){
"use strict";

/* Semantics
 ******************************************************************************/
/**
 * Variable declaration.
 * 
 * @param {Array} declarations One or more computations declaring a variable.
 */
var variableDeclaration = function(declarations) {
    return statement.statementList(declarations);
};

/**
 * Single variable declarator with initial value
 * 
 * @param {string} id Identifier to bind to value.
 * @param init Computation for initial value of the bound variable.
 */
var variableInitDeclarator = function(id, init) {
    return compute.bind(execution_context.strict, function(strict) {
        if (strict && (id === "eval" || id === "arguments"))
            return statement.attempt(error.syntaxError(string.create("Using eval/arguments in strict")));
        return statement.attempt(complete.completeNormalFrom(
            environment.putMutableBinding(
                id,
                debug.debuggable(internal_reference.getValue(init)))));
    });
};

/**
 * Single variable declarator without initial value.
 * 
 * @param {string} id Identifier to bind to value.
 */
var variableDeclarator = function(id) {
    return variableInitDeclarator(id, undef.UNDEFINED);
};

/**
 * Function declaration.
 * 
 * @param {string} id Identifier to bind to value.
 * @param params Array of identifiers for this function's parameters.
 * @param body Computation for the body of the function.
 * @param strict Is the body of the function explicitly strict code.
 */
var functionDeclaration = function(name, params, body, strict) {
    return complete.completeNormalFrom(
        environment.putMutableBinding(
            name,
            func.fun(name, params, body, strict)));
};

/* Export
 ******************************************************************************/
return {
    'variableDeclaration': variableDeclaration,
    'variableInitDeclarator': variableInitDeclarator,
    'variableDeclarator': variableDeclarator,
    'functionDeclaration': functionDeclaration
};

});