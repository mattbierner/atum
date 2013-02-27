define(['atum/compute',
        'atum/context/environment'],
function(compute,
        environment) {
//"use strict";

/**
 * 
 */
var getIdentifierReference = function(name) {
    return function(ctx, ok, err) {
        var resolved = environment.getIdentifierReference(ctx.lexicalEnvironment, name, ctx.strict);
        return (resolved ?
            ok(resolved, ctx) :
            err("Resolved err", ctx));
    };
};


return {
    'getIdentifierReference': getIdentifierReference
};

});