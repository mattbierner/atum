/**
 * @fileOverview Data structures and operations for creating and manipulating  
 * lexical environments.
 */
define(['amulet/object',
        'atum/context/environment_record',
        'atum/compute',
        'atum/reference',
        'atum/value/undef'],
function(amulet_object,
        environment_record,
        compute,
        reference,
        undef) {
//"use strict";
    
/* Lexical Environment
 ******************************************************************************/
/**
 * ECMAscript lexical environment.
 * 
 * Lexical environments store a binding record and a parent environment.
 */
var LexicalEnvironment = function(outer, record) {
    this.record = record;
    this.outer = outer;
};

LexicalEnvironment.prototype.implicitThisValue = function() {
    return new undef.Undefined();
}

/**
 * 
 */
var hasIdentifierReference = function(lex, name) {
    if (lex === null) {
        return null;
    }
    return environment_record.hasBinding(lex.record, name);
};

/**
 * 
 */
var getIdentifierReference = function(ctx, ref, name, strict) {
    if (ref === null) {
        return compute.always(null);
    }
    return compute.bind(
        ref.dereference(ctx),
        function(lex) {
            return (environment_record.hasBinding(lex.record, name) ?
                compute.always(ref) :
                getIdentifierReference(ctx, lex.outer, name, strict));
        })

};

/**
 * 
 */
var putIdentifierReference = function(lex, name, value) {
    return new LexicalEnvironment(
        lex.outer,
        environment_record.setMutableBinding(lex.record, name, value));
};

/**
 * 
 */
var setIdentifierReference = function(ctx, ref, name, value) {
    if (!ref) {
        return compute.always(null);
    }
    return compute.bind(
        ref.dereference(ctx),
        function(lex) {
            if (lex.outer === null || environment_record.hasBinding(lex.record, name)) {
                return ref.set(compute.always(new LexicalEnvironment(lex.outer, environment_record.setMutableBinding(lex.record, name, value))));
            }
            return setIdentifierReference(ctx, lex.outer, name, value);
        });
};

/* Declarative Lexical Environment
 ******************************************************************************/
/**
 * Declarative lexical environment.
 * 
 * @param [outer] Parent of environment.
 */
var DeclarativeLexicalEnvironment = function(outer) {
    LexicalEnvironment.call(this, (outer || null), {});
};
DeclarativeLexicalEnvironment.prototype = new LexicalEnvironment;

DeclarativeLexicalEnvironment.prototype.implicitThisValue = function() {
    return undefined;
}

/* Object Lexical Environment
 ******************************************************************************/
/**
 * Object Lexical environment.with a given set of bindings 'o' and parent 'outer'.
 * 
 * @param [outer] Parent of environment.
 * @param [record] Environment record with bindings for environment.
 */
var ObjectLexicalEnvironment = function(outer, record) {
    LexicalEnvironment.call(this, (outer || null), (record || {}));
};
ObjectLexicalEnvironment.prototype = new LexicalEnvironment;

ObjectLexicalEnvironment.prototype.implicitThisValue = function() {
    return undefined;
};

/* Export
 ******************************************************************************/
return {
// Lexical Environment
    'LexicalEnvironment': LexicalEnvironment,
    
    'hasIdentifierReference': hasIdentifierReference,
    'getIdentifierReference': getIdentifierReference,
    'putIdentifierReference': putIdentifierReference,
    'setIdentifierReference': setIdentifierReference,

    'DeclarativeLexicalEnvironment': DeclarativeLexicalEnvironment,
    'ObjectLexicalEnvironment': ObjectLexicalEnvironment,

};

});