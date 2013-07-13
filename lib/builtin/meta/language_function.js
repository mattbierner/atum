/**
 * 
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/func',
        'atum/builtin/meta/func',
        'atum/context/environment',
        'atum/value/type',
        'atum/value/value',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/type_conversion',
        'atum/operations/undef'],
function(exports,
        amulet_object,
        compute,
        value_reference,
        func,
        meta_func,
        environment,
        type,
        value,
        environment_semantics,
        execution_context_semantics,
        type_conversion,
        undef){
//"use strict";

/* LanguageFunction
 ******************************************************************************/
/**
 * Meta object class for a hosted language function from code.
 */
var LanguageFunction = function(proto, props, scope, id, names, body, strict) {
    func.FunctionPrototype.call(this, proto, props);
    this.id = id;
    this.names = (names || []);
    this.scope = scope;
    this.body = body;
    this.strict = strict;
};
LanguageFunction.prototype = new func.FunctionPrototype;
LanguageFunction.prototype.constructor = LanguageFunction;

/**
 * 
 */
LanguageFunction.prototype.call = function(ref, thisObj, args) {
    var that = this;
    
    if (!this.strict && !(thisObj instanceof value_reference.ValueReference)) {
        switch (value.type(thisObj)) {
        case type.UNDEFINED_TYPE:
        case type.NULL_TYPE:
            return compute.bind(
                execution_context_semantics.getThisBinding(),
                function(thisObj) {
                    return that.call(ref, thisObj, args);
                });
        case type.STRING_TYPE:
        case type.NUMBER_TYPE:
        case type.BOOLEAN_TYPE:
            return compute.bind(type_conversion.toObject(compute.just(thisObj)), function(thisObj) {
                return that.call(ref, thisObj, args);
            });
        }
    }
    
    var strict = this.strict,
        names = this.names,
        scope = this.scope,
        body = this.body,
        id = this.id;
    return compute.bind(
        environment_semantics.createDeclativeEnvironment(scope),
        function(env) {
            var env = compute.just(env);
            return environment_semantics.withEnvironment(env,
                execution_context_semantics.withThisBinding(thisObj,
                    compute.next(
                        (id ? environment_semantics.putEnvironmentMutableBinding(env, id, strict, compute.just(ref)) : compute.empty),
                        names.reduceRight(function(p, c, i) {
                            var v = (i >= args.length ? undef.create() : compute.just(args[i]));
                            return compute.next(
                                environment_semantics.putEnvironmentMutableBinding(env, c, strict, v),
                                p);
                        }, body))))
        });
};

LanguageFunction.prototype.defineProperty = function(name, desc) {
    var obj = new LanguageFunction(this.proto, this.props, this.scope, this.id, this.names, this.body, this.strict);
    obj.properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return obj;
};

/* Export
 ******************************************************************************/
exports.LanguageFunction = LanguageFunction;

});