/**
 * @fileOverview Declaration semantics.
 */
define(['atum/compute',
        'atum/fun',
        'atum/compute/statement',
        'atum/debug/operations',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/string',
        'atum/operations/undef',
        'atum/semantics/func',
        'atum/semantics/statement'],
function(compute,
        fun,
        statement,
        debug,
        environment,
        error,
        execution_context,
        internal_reference,
        string,
        undef,
        func,
        statement_semantics){
"use strict";

/* Semantics
 ******************************************************************************/
/**
 * Variable declaration.
 * 
 * @param {Array} declarations One or more computations declaring a variable.
 */
var variableDeclaration = statement_semantics.statementList;

/**
 * Single variable declarator with initial value
 * 
 * @param {string} id Identifier to bind to value.
 * @param init Computation for initial value of the bound variable.
 */
var variableInitDeclarator = function(id, init) {
    return compute.bind(execution_context.strict, function(strict) {
        if (strict && (id === "eval" || id === "arguments"))
            return statement.liftExpression(error.syntaxError(string.create("Using eval/arguments in strict")));
        return statement.liftExpression(
            compute.bind(
                debug.debuggable(internal_reference.getFrom(init)),
                fun.curry(environment.putMutableBinding, id)));
    });
};

/**
 * Single variable declarator without initial value.
 * 
 * @param {string} id Identifier to bind to value.
 */
var variableDeclarator = fun.placeholder(variableInitDeclarator, fun._, undef.UNDEFINED);

/**
 * Function declaration.
 * 
 * @param {string} id Identifier to bind to value.
 * @param params Array of identifiers for this function's parameters.
 * @param body Computation for the body of the function.
 * @param strict Is the body of the function explicitly strict code.
 */
var functionDeclaration = function(name, params, body, strict) {
    return statement.bindExpression(
        compute.bind(func.fun(name, params, body, strict), function(fn) {
            return environment.putMutableBinding(name, fn);
        }),
        statement.completeNormal);
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