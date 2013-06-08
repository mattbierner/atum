/**
 * 
 */
define(['atum/compute',
        'atum/builtin/object',
        'atum/builtin/func',
        'atum/value/undef',
        'atum/context/environment',
        'atum/operations/reference',
        'atum/iref',
        'atum/value/type',
        'atum/value/value',
        'atum/builtin/object',
        'atum/operations/value_reference',
        'atum/operations/environment',
        'atum/operations/execution_context'],
function(compute,
        builtin_object,
        func,
        undef,
        environment,
        reference,
        iref,
        type,
        value,
        builtin_object,
        value_reference,
        environment_semantics,
        execution_context_semantics){
//"use strict";

/* LanguageFunction
 ******************************************************************************/
/**
 * Meta object class for a hosted language function from code.
 */
var LanguageFunction = function(scope, id, names, body, strict) {
    this.id = id;
    this.names = (names || []);
    this.scope = scope;
    this.body = body;
    this.strict = strict;
};
LanguageFunction.prototype = new func.Function;

/**
 * 
 */
LanguageFunction.prototype.call = function(thisObj, args) {
    var strict = this.strict,
        names = this.names,
        scope = this.scope,
        body = this.body,
        id = this.id;
    var that = this;
    return compute.bind(
        environment_semantics.createEnvironment(new environment.DeclarativeLexicalEnvironment(scope)),
        function(e) {
            return environment_semantics.withEnvironment(e,
                execution_context_semantics.withThisBinding(thisObj,
                    compute.next(
                        (id ? environment_semantics.putMutableBinding(id, strict, compute.always(that)) : compute.always(null)),
                        names.reduceRight(function(p, c, i) {
                            var v = (i >= args.length ? new undef.Undefined() : args[i]);
                            return compute.next(
                                environment_semantics.putMutableBinding(c, strict, compute.always(v)),
                                p);
                        }, body))));
        });
};

/**
 * Internal function object construction
 * 
 * @TODO: hookup default object prototype.
 */
LanguageFunction.prototype.construct = function(args) {
    var proto = (this.proto && value.type(this.proto) === type.OBJECT_TYPE ? 
        this.proto :
        require('atum/builtin/object').ObjectPrototypeRef);
    
    var obj = amulet_object.defineProperty(new object.Object(proto), 'Class', {
        'value': 'Object',
        'extensible': true
    });
    var that = this;
    return compute.bind(
        value_reference.create(compute.always(obj)),
        function(ref) {
            return compute.next(
                that.call(ref, args),
                compute.always(ref));
        });

};

/* Export
 ******************************************************************************/
return {
    'LanguageFunction': LanguageFunction,
};

});