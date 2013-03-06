define(['atum/compute',
        'atum/context/environment',
        'atum/reference'],
function(compute,
        environment,
        reference) {
//"use strict";
    
/**
 */
var getIdentifierReference = function(name) {
    return function(ctx, ok, err) {
        var resolved = environment.getIdentifierReference(ctx.lexicalEnvironment, name, ctx.strict);
        return ok((resolved ?
                resolved :
                new reference.Reference(name, undefined)), ctx);
    };
};

/**
 * Computation that sets the value of an existing binding.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var setMutableBinding = function(name, strict, value) {
    return compute.bind(value, function(v) {
        return function(ctx, ok, err) {
            var newCtx = ctx.setValue(v.key, v);
            var lex = environment.setIdentifierReference(ctx.lexicalEnvironment, name, v.key, strict);
            return ok(v, newCtx.setLexicalEnvironment(lex));
        };
    });
};

/**
 * Computation that creates a new binding.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var putMutableBinding = function(name, strict, value) {
    return compute.bind(value, function(v) {
        return function(ctx, ok, err) {
            var newCtx = ctx.setValue(v.key, v);
            var lex = environment.putIdentifierReference(ctx.lexicalEnvironment, name, v.key, strict);
            return ok(v, newCtx.setLexicalEnvironment(lex));
        };
    });
};


return {
    'getIdentifierReference': getIdentifierReference,
    'setMutableBinding': setMutableBinding,
    'putMutableBinding': putMutableBinding
};

});