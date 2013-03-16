define(['atum/compute',
        'atum/context/environment',
        'atum/reference',
        'atum/semantics/iref',
        'atum/iref'],
function(compute,
        environment,
        reference,
        iref,
        irr) {
//"use strict";

/*
 ******************************************************************************/
/**
 * 
 */
var getIdentifierReference = function(name) {
    return function(ctx, ok, err) {
        var resolved = environment.getIdentifierReference(irr.getValue(ctx.lexicalEnvironment, ctx), name, ctx.strict);
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
    return compute.bind(
        iref.create(value),
        function(v) {
            return function(ctx, ok, err) {
                var lex = environment.setIdentifierReference(irr.getValue(ctx.lexicalEnvironment, ctx), name, v, strict);
                return ok(v, ctx.setLexicalEnvironment(lex));
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
    return compute.bind(
        iref.create(value),
        function(v) {
            return function(ctx, ok, err) {
                var lex = environment.putIdentifierReference(irr.getValue(ctx.lexicalEnvironment, ctx), name, v, strict);
                return ok(v, ctx.setLexicalEnvironment(lex));
            };
        });
};

/* Export
 ******************************************************************************/
return {
    'getIdentifierReference': getIdentifierReference,
    'setMutableBinding': setMutableBinding,
    'putMutableBinding': putMutableBinding
};

});