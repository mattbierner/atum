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
var ExecutionContext = function(type, strict, lexicalEnvironment, variableEnvironment, thisBinding, values) {
    this.type = type;
    this.strict = !!strict;
    this.lexicalEnvironment = lexicalEnvironment;
    this.variableEnvironment = variableEnvironment;
    this.thisBinding = thisBinding;
    this.values = (values || {});
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
        this.thisBinding,
        this.values);
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
        this.thisBinding,
        this.values);
};

ExecutionContext.prototype.addValue = function(key, value) {
    return new ExecutionContext(
        this.type,
        this.strict,
        this.lexicalEnvironment,
        this.variableEnvironment,
        this.thisBinding,
        amulet_object.defineProperty(this.values, key, {
            'value': value,
            'enumerable': true,
            'configurable': true
        }));
};

ExecutionContext.prototype.setValue = function(key, value) {
    return new ExecutionContext(
        this.type,
        this.strict,
        this.lexicalEnvironment,
        this.variableEnvironment,
        this.thisBinding,
        amulet_object.defineProperty(this.values, key, {
            'value': value,
            'enumerable': true,
            'configurable': true
        }));
};

ExecutionContext.prototype.getValue = function(key) {
    return this.values[key];
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