/**
 * @fileOverview Declaration semantics.
 */
define(['atum/compute',
        'atum/fun',
        'atum/operations/environment',
        'atum/operations/error',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/undef',
        'atum/semantics/func'],
function(compute,
        fun,
        environment,
        error,
        execution_context,
        internal_reference,
        undef,
        func){
"use strict";

/* Semantics
 ******************************************************************************/
/**
 * Variable declaration.
 * 
 * @param {Array} declarations One or more computations declaring a variable.
 */
var variableDeclaration = compute.sequencea;

/**
 * Single variable declarator with initial value
 * 
 * @param {string} id Identifier to bind to value.
 * @param init Computation for initial value of the bound variable.
 */
var variableInitDeclarator = function(id, init) {
    return compute.bind(
        execution_context.strict,
        function(strict) {
            if (strict && (id === "eval" || id === "arguments"))
                return error.syntaxError("Using eval/arguments in strict");
            return internal_reference.dereferenceFrom(init, function(value) {
                return environment.putMutableBinding(id, value);
            });
        });
};

/**
 * Single variable declarator without initial value.
 * 
 * @param {string} id Identifier to bind to value.
 */
var variableDeclarator = fun.placeholder(variableInitDeclarator,
    fun._,
    undef.UNDEFINED);

/**
 * Function declaration.
 * 
 * @param {string} id Identifier to bind to value.
 * @param params Array of identifiers for this function's parameters.
 * @param body Computation for the body of the function.
 * @param strict Is the body of the function explicitly strict code.
 */
var functionDeclaration = function(name, strict, params, code, declarations, body) {
    return variableInitDeclarator(
        name,
        func.fun(name, strict, params, code, declarations, body));
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