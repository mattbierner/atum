/**
 * @fileOverview
 */
define(['amulet/object'],
function(amulet_object) {
//"use strict";

/*
 ******************************************************************************/

/* Execution Context
 ******************************************************************************/
/**
 * 
 */
var GLOBAL = 1,
    EVAL = 2,
    FUNCTION = 3;

/**
 * 
 * @param lexicalEnvironment Iref to an environment.
 * @param variableEnvironment Iref to an environment.
 */
var ExecutionContext = function(type, strict, lexicalEnvironment, variableEnvironment, thisBinding) {
    this.type = type;
    this.strict = !!strict;
    this.lexicalEnvironment = lexicalEnvironment;
    this.variableEnvironment = variableEnvironment;
    this.thisBinding = thisBinding;
};

Object.defineProperties(ExecutionContext.prototype, {
    'global': {
        'get': function() {
            var lex = this.lexicalEnvironment;
            while (lex.outer !== null) {
                lex = lex.outer;
            }
            return lex;
        }
    }
});

/**
 * 
 */
ExecutionContext.prototype.setLexicalEnvironment = function(lex) {
    return new ExecutionContext(
        this.type,
        this.strict,
        lex,
        this.variableEnvironment,
        this.thisBinding);
};

/**
 * 
 */
ExecutionContext.prototype.setVariableEnvironment = function(lex) {
    return new ExecutionContext(
        this.type,
        this.strict,
        this.lexicalEnvironment,
        lex,
        this.thisBinding);
};

/**
 * 
 */
ExecutionContext.prototype.setThisBinding = function(t) {
    return new ExecutionContext(
        this.type,
        this.strict,
        this.lexicalEnvironment,
        this.variableEnvironment,
        t);
};

/* Export
 ******************************************************************************/
return {
    'GLOBAL': GLOBAL,
    'EVAL': EVAL,
    'FUNCTION': FUNCTION,
    
    'ExecutionContext': ExecutionContext
};

});