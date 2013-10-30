/**
 * @fileOverview
 */
define(['amulet/record',
        'atum/context/execution_metadata'],
function(record,
        execution_metadata) {
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
var ExecutionContext = record.declare(null, [
    'type',
    'settings',
    'strict',
    'lexicalEnvironment',
    'variableEnvironment',
    'thisBinding',
    'global',
    'metadata']);

var setType = ExecutionContext.setType;

var setSettings = ExecutionContext.setSettings

var setStrictness = ExecutionContext.setStrict;

var setLexicalEnvironment = ExecutionContext.setLexicalEnvironment;

var setVariableEnvironment = ExecutionContext.setVariableEnvironment;

var setThisBinding = ExecutionContext.setThisBinding;

var setMetadata = ExecutionContext.setMetadata;

/* Creation
 ******************************************************************************/
/**
 * 
 */
var createGlobalContext = function(settings, env, obj) {
    return ExecutionContext.create(
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