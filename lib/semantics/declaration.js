/**
 * @fileOverview Declaration semantics.
 */
define(['atum/compute',
        'atum/operations/environment',
        'atum/operations/internal_reference',
        'atum/operations/undef',
        'atum/semantics/func'],
function(compute,
        environment,
        internal_reference,
        undef,
        func_semantics){
"use strict";

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

/* Semantics
 ******************************************************************************/
/**
 * Semantics for a variable declaration.
 * 
 * @param {Array} declarations One or more computations for declaring a variable.
 */
var variableDeclaration = function(declarations) {
    return reduce(declarations, compute.next);
};

/**
 * Semantics for a single variable declarator with initial value.
 * 
 * @param {string} id Identifier to bind to value.
 * @param init Computation for initial value of the bound variable.
 */
var variableInitDeclarator = function(id, init) {
    return environment.putMutableBinding(id,internal_reference.getValue(init));
};

/**
 * Semantics for a single variable declarator without initial value.
 * 
 * @param {string} id Identifier to bind to value.
 */
var variableDeclarator = function(id) {
    return variableInitDeclarator(id, undef.create());
};

/**
 * Semantics for a function declaration.
 * 
 * @parma {string} id Identifier to bind to value.
 * @param params Array of identifiers for this function's parameters.
 * @para body Computation for the body of the function.
 */
var functionDeclaration = function(name, params, body) {
    return variableInitDeclarator(name, func_semantics.functionExpression(name, params, body));
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