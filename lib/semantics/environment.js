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
        return (resolved ?
            ok(resolved, ctx) :
            ok(new reference.Reference(name, undefined), ctx));
    };
};

/**
 * 
 */
var setMutableBinding = function(name, value, strict) {
    return function(ctx, ok, err) {
        return ok(value, ctx.setLexicalEnvironment(environment.putIdentifierReference(ctx.lexicalEnvironment, name, value, strict)));
    };
};


return {
    'getIdentifierReference': getIdentifierReference,
    'setMutableBinding': setMutableBinding
};

});