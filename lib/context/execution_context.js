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
 */
var ExecutionContext = function(type, settings, strict, lexicalEnvironment, variableEnvironment, thisBinding, global, stack, loc) {
    this.type = type;
    this.settings = settings;
    this.strict = !!strict;
    this.lexicalEnvironment = lexicalEnvironment;
    this.variableEnvironment = variableEnvironment;
    this.thisBinding = thisBinding;
    this.global = global;
    this.stack = stack;
    this.loc = loc;
};

/**
 * 
 */
var setType = function(ctx, type) {
    return new ExecutionContext(
        type,
        ctx.settings,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global,
        ctx.stack,
        ctx.loc);
};

/**
 * 
 */
var setSettings = function(ctx, settings) {
    return new ExecutionContext(
        ctx.type,
        settings,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global,
        ctx.stack,
        ctx.loc);
};

/**
 * 
 */
var setLexicalEnvironment = function(ctx, env) {
    return new ExecutionContext(
        ctx.type,
        ctx.settings,
        ctx.strict,
        env,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global,
        ctx.stack,
        ctx.loc);
};

/**
 * 
 */
var setVariableEnvironment = function(ctx, env) {
    return new ExecutionContext(
        ctx.type,
        ctx.settings,
        ctx.strict,
        ctx.lexicalEnvironment,
        env,
        ctx.thisBinding,
        ctx.global, 
        ctx.stack,
        ctx.loc);
};

/**
 * 
 */
var setThisBinding = function(ctx, thisObj) {
    return new ExecutionContext(
        ctx.type,
        ctx.settings,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        thisObj,
        ctx.global,
        ctx.stack,
        ctx.loc);
};

/**
 * 
 */
var setStack = function(ctx, stack) {
    return new ExecutionContext(
        ctx.type,
        ctx.settings,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global,
        stack,
        ctx.loc);
};

/**
 * 
 */
var setLocation = function(ctx, loc) {
    return new ExecutionContext(
        ctx.type,
        ctx.settings,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global,
        ctx.stack,
        loc);
};

/* Creation
 ******************************************************************************/
/**
 * 
 */
var createGlobalContext = function(settings, env, obj) {
    return new ExecutionContext(
        ExecutionContextType.GLOBAL,
        settings,
        false,
        env,
        env,
        obj,
        env,
        []);
};

/* Export
 ******************************************************************************/
return {
    'ExecutionContextType': ExecutionContextType,
    
    'ExecutionContext': ExecutionContext,
    
// Operations
    'setType': setType,
    'setSettings': setSettings,
    'setLexicalEnvironment': setLexicalEnvironment,
    'setVariableEnvironment': setVariableEnvironment,
    'setThisBinding': setThisBinding,
    'setStack': setStack,
    'setLocation': setLocation,
    
// Creation
    'createGlobalContext': createGlobalContext
};

});