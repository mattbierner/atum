/**
 * @fileOverview
 */
define(['atum/context/execution_metadata'],
function(execution_metadata) {
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
var ExecutionContext = function(
    type,
    settings,
    strict,
    lexicalEnvironment,
    variableEnvironment,
    thisBinding,
    global,
    metadata
) {
    this.type = type;
    this.settings = settings;
    this.strict = !!strict;
    this.lexicalEnvironment = lexicalEnvironment;
    this.variableEnvironment = variableEnvironment;
    this.thisBinding = thisBinding;
    this.global = global;
    this.metadata = metadata;
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
        ctx.metadata);
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
var setStrictness = function(ctx, strict) {
    return new ExecutionContext(
        ctx.type,
        ctx.settings,
        strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global,
        ctx.metadata);
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
        ctx.metadata);
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
        ctx.metadata);
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
        ctx.metadata);
};

/**
 * 
 */
var setMetadata = function(ctx, metadata) {
    return new ExecutionContext(
        ctx.type,
        ctx.settings,
        ctx.strict,
        ctx.lexicalEnvironment,
        ctx.variableEnvironment,
        ctx.thisBinding,
        ctx.global,
        metadata);
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
        execution_metadata.empty);
};

/* Export
 ******************************************************************************/
return {
    'ExecutionContextType': ExecutionContextType,
    
    'ExecutionContext': ExecutionContext,
    
// Operations
    'setType': setType,
    'setSettings': setSettings,
    'setStrictness': setStrictness,
    'setLexicalEnvironment': setLexicalEnvironment,
    'setVariableEnvironment': setVariableEnvironment,
    'setThisBinding': setThisBinding,
    'setMetadata': setMetadata,
    
// Creation
    'createGlobalContext': createGlobalContext
};

});