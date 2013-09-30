/**
 * Language function meta object.
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/func',
        'atum/builtin/operations/args',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/func',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/value',],
function(exports,
        compute,
        meta_func,
        bargs,
        environment,
        execution_context,
        func,
        type_conversion,
        value_reference,
        type,
        value){
"use strict";

/* LanguageFunction
 ******************************************************************************/
/**
 * Meta object for a hosted language function defined in code.
 */
var LanguageFunction = function(proto, props, scope, id, names, body, strict) {
    meta_func.Function.call(this, proto, props);
    this.id = id;
    this.names = (names || []);
    this.scope = scope;
    this.body = body;
    this.strict = strict;
};
LanguageFunction.prototype = new meta_func.Function;
LanguageFunction.prototype.constructor = LanguageFunction;

LanguageFunction.prototype.setProperties = function(properties) {
    return new LanguageFunction(
        this.proto,
        properties,
        this.scope,
        this.id,
        this.names,
        this.body,
        this.strict);
};

LanguageFunction.prototype.setPrototype = function(proto) {
    return new LanguageFunction(
        proto,
        this.properties,
        this.scope,
        this.id,
        this.names,
        this.body,
        this.strict);
};

/**
 * 
 */
LanguageFunction.prototype.call = function(ref, thisObj, args) {
    var body = this.body,
        id = this.id,
        scope = this.scope,
        strict = this.strict,
        names = this.names;
    return value_reference.dereference(thisObj, function(t, thisObj) {;
        if (!strict && !value.isObject(t)) {
            switch (value.type(t)) {
            case type.UNDEFINED:
            case type.NULL:
                return compute.bind(execution_context.thisBinding, function(t) {
                    return func.forward(ref, t, args);
                });
            case type.STRING:
            case type.NUMBER:
            case type.BOOLEAN:
                return compute.bind(type_conversion.toObject(thisObj), function(t) {
                    return func.forward(ref, t, args);
                });
            }
        }
        
        return environment.environmentBlock(
            compute.sequence(
                compute.bind(environment.createDeclativeEnvironment(scope), environment.setEnvironment),
                (id ? environment.putStrictnessImmutableBinding(id, strict, ref) : compute.empty),
                compute.bind(environment.getEnvironment, function(env) {
                    return compute.bind(bargs.create(ref, names, args, env, strict), function(a) {
                        return environment.putStrictnessImmutableBinding('arguments', strict, a);
                    });
                }),
                compute.sequencea(names.map(function(x, i) {
                    return environment.putStrictnessMutableBinding(x, strict, args.getArg(i));
                })),
                execution_context.withThisBinding(thisObj, body)));
    });
};

/* Export
 ******************************************************************************/
exports.LanguageFunction = LanguageFunction;

});