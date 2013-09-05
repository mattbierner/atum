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
    return environment.putMutableBinding(
        id,
        debug.debuggable(internal_reference.getValue(init)));
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
 */
var functionDeclaration = function(name, params, body) {
    return environment.putMutableBinding(
        name,
        func.fun(name, params, body));
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