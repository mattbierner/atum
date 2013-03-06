define(['atum/compute',
        'atum/context/environment',
        'atum/reference'],
function(compute,
        environment,
        reference) {
//"use strict";

/**
 * 
 */
var getIdentifierReference = function(name) {
    return function(ctx, ok, err) {
        var resolved = environment.getIdentifierReference(ctx.lexicalEnvironment, name, ctx.strict);
        return ok((resolved ? resolved : new reference.Reference(name, undefined)), ctx);
    };
};

/**
 * Computation that sets the value of an existing binding.
 */
var setMutableBinding = function(name, strict, value) {
    return compute.bind(value, function(v) {
        return function(ctx, ok, err) {
            return ok(v, ctx.setLexicalEnvironment(environment.setIdentifierReference(ctx.lexicalEnvironment, name, v, strict)));
        };
    });
};

/**
 * Computation that creates a new binding.
 */
var putMutableBinding = function(name, strict, value) {
    return compute.bind(value, function(v) {
        return function(ctx, ok, err) {
            return ok(v, ctx.setLexicalEnvironment(environment.putIdentifierReference(ctx.lexicalEnvironment, name, v, strict)));
        };
    });
};


return {
    'getIdentifierReference': getIdentifierReference,
    'setMutableBinding': setMutableBinding,
    'putMutableBinding': putMutableBinding
};

});