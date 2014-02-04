/**
 * @fileOverview ECMAscript execution context.
 */
define(['bes/record',
        'atum/context/execution_metadata'],
function(record,
        execution_metadata) {
"use strict";

/* Execution Context
 ******************************************************************************/
/**
 * ECMAscript execution context.
 * 
 * @member settings Execution settings.
 * @member strict Is the context in strict mode?
 * @member lexicalEnvironment Lexical environment of program.
 * @member variableEnvironment Declarative environment of program.
 * @member global Reference to global object.
 * @member metadata Execution metadata.
 * @member semantics
 */
var ExecutionContext = record.declare(null, [
    'settings',
    'strict',
    'lexicalEnvironment',
    'variableEnvironment',
    'thisBinding',
    'global',
    'metadata',
    'semantics']);

ExecutionContext.empty = ExecutionContext.create(
    null,
    false,
    null,
    null,
    null,
    null,
    execution_metadata.empty,
    null);

/* Creation
 ******************************************************************************/
/**
 * Create a new, global execution context.
 * 
 * @param settings Execution settings.
 * @param env Reference to global environment.
 * @param obj Reference to global object.
 * @param semantics
 */
var createGlobalContext = function(settings, env, obj, semantics) {
    return ExecutionContext.create(
        settings,
        false,
        env,
        env,
        obj,
        env,
        execution_metadata.empty,
        semantics);
};

/* Export
 ******************************************************************************/
return {
    'ExecutionContext': ExecutionContext,
    
// Creation
    'createGlobalContext': createGlobalContext
};

});