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
    
    
// Creation
    'createGlobalContext': createGlobalContext
};

});