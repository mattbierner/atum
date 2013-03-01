define(function() {
"use strict";

/* 
 ******************************************************************************/
var GLOBAL = 1,
    EVAL = 2,
    FUNCTION = 3;

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

ExecutionContext.prototype.setLexicalEnvironment = function(lex) {
    return new ExecutionContext(this.type, this.strict, lex, this.variableEnvironment, this.thisBinding);
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