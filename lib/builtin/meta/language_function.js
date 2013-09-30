/**
 * Language function meta object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/meta/func',
        'atum/builtin/operations/args',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/func',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/value/type',
        'atum/value/value',],
function(exports,
        compute,
        value_reference,
        meta_func,
        bargs,
        environment,
        execution_context,
        func,
        type_conversion,
        undef,
        type,
        value){
//"use strict";

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
    var self = this;
    if (!this.strict && !(thisObj instanceof value_reference.ValueReference)) {
        switch (value.type(thisObj)) {
        case type.UNDEFINED_TYPE:
        case type.NULL_TYPE:
            return compute.bind(execution_context.thisBinding, function(t) {
                return func.apply(ref, t, args);
            });
        case type.STRING_TYPE:
        case type.NUMBER_TYPE:
        case type.BOOLEAN_TYPE:
            return compute.bind(type_conversion.toObject(thisObj), function(t) {
                return func.apply(ref, t, args);
            });
        }
    }
    
    var strict = this.strict,
        names = this.names,
        scope = this.scope,
        body = this.body,
        id = this.id;
    
    return environment.environmentBlock(
        compute.sequence(
            compute.bind(environment.createDeclativeEnvironment(scope), environment.setEnvironment),
            (id ? environment.putStrictnessMutableBinding(id, strict, ref) : compute.empty),
            compute.bind(environment.getEnvironment, function(env) {
                return compute.bind(bargs.create(ref, names, args, env, strict), function(a) {
                    return environment.putStrictnessImmutableBinding('arguments', strict, a);
                });
            }),
            compute.sequencea(names.map(function(x, i) {
                return environment.putStrictnessMutableBinding(x, strict, args.getArg(i));
            })),
            execution_context.withThisBinding(thisObj, body)));
};

/* Export
 ******************************************************************************/
exports.LanguageFunction = LanguageFunction;

});