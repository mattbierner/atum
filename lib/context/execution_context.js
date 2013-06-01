/**
 * @fileOverview
 */
define([],
function() {
"use strict";

/* Constants
 ******************************************************************************/
/**
 * 
 */
var ExecutionContextType = Object.freeze({
    'GLOBAL': 1,
    'EVAL': 2,
    'FUNCTION': 3
});

/* Execution Context
 ******************************************************************************/
/**
 * 
 * @param lexicalEnvironment Iref to an environment.
 * @param variableEnvironment Iref to an environment.
 */
var ExecutionContext = function(type, strict, lexicalEnvironment, variableEnvironment, thisBinding, global) {
    this.type = type;
    this.strict = !!strict;
    this.lexicalEnvironment = lexicalEnvironment;
    this.variableEnvironment = variableEnvironment;
    this.thisBinding = thisBinding;
    this.global = global;
};

/**
 * 
 */
var setType = function(ctx, type) {
    return new ExecutionContext(
        type,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global);
};

/**
 * 
 */
var setLexicalEnvironment = function(ctx, env) {
    return new ExecutionContext(
        ctx.type,
        ctx.strict,
        env,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global);
};

/**
 * 
 */
var setVariableEnvironment = function(ctx, env) {
    return new ExecutionContext(
        ctx.type,
        ctx.strict,
        ctx.lexicalEnvironment,
        env,
        ctx.thisBinding,
        ctx.global);
};

/**
 * 
 */
var setThisBinding = function(ctx, thisObj) {
    return new ExecutionContext(
        ctx.type,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        thisObj,
        ctx.global);
};

/* Export
 ******************************************************************************/
return {
    'ExecutionContextType': ExecutionContextType,
    
    'ExecutionContext': ExecutionContext,
    
    'setType': setType,
    'setLexicalEnvironment': setLexicalEnvironment,
    'setVariableEnvironment': setVariableEnvironment,
    'setThisBinding': setThisBinding
};

});