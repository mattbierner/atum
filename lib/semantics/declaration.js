/**
 * @fileOverview Declaration semantics.
 */
define(['atum/compute',
        'atum/debug/operations',
        'atum/operations/environment',
        'atum/operations/internal_reference',
        'atum/operations/undef',
        'atum/semantics/func'],
function(compute,
        debug,
        environment,
        internal_reference,
        undef,
        func_semantics){
"use strict";

/* Semantics
 ******************************************************************************/
/**
 * Variable declaration semantics.
 * 
 * @param {Array} declarations One or more computations for declaring a variable.
 */
var variableDeclaration = compute.sequencea;

/**
 * Single variable declarator with initial value semantics.
 * 
 * @param {string} id Identifier to bind to value.
 * @param init Computation for initial value of the bound variable.
 */
var variableInitDeclarator = function(id, init) {
    return environment.putMutableBinding(
        id,
        debug.debuggable(internal_reference.getValue(init)));
};

/**
 * single variable declarator without initial value semantics.
 * 
 * @param {string} id Identifier to bind to value.
 */
var variableDeclarator = function(id) {
    return variableInitDeclarator(id, undef.UNDEFINED);
};

/**
 * Semantics for a function declaration.
 * 
 * @parma {string} id Identifier to bind to value.
 * @param params Array of identifiers for this function's parameters.
 * @para body Computation for the body of the function.
 */
var functionDeclaration = function(name, params, body) {
    return environment.putMutableBinding(
        name,
        func_semantics.functionExpression(name, params, body));
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