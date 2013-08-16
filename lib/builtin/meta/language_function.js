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
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/value/type',
        'atum/value/value',],
function(exports,
        amulet_object,
        compute,
        value_reference,
        func,
        meta_func,
        environment,
        environment_semantics,
        execution_context_semantics,
        type_conversion,
        undef,
        type,
        value){
//"use strict";

/* LanguageFunction
 ******************************************************************************/
/**
 * Meta object class for a hosted language function from code.
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

/**
 * 
 */
LanguageFunction.prototype.call = function(ref, thisObj, args) {
    var self = this;
    
    if (!this.strict && !(thisObj instanceof value_reference.ValueReference)) {
        switch (value.type(thisObj)) {
        case type.UNDEFINED_TYPE:
        case type.NULL_TYPE:
            return compute.bind(
                execution_context_semantics.getThisBinding(),
                function(thisObj) {
                    return self.call(ref, thisObj, args);
                });
        case type.STRING_TYPE:
        case type.NUMBER_TYPE:
        case type.BOOLEAN_TYPE:
            return compute.bind(
                type_conversion.toObject(compute.just(thisObj)),
                function(thisObj) {
                    return self.call(ref, thisObj, args);
                });
        }
    }
    
    var strict = this.strict,
        names = this.names,
        scope = this.scope,
        body = this.body,
        id = this.id;
    
    return environment_semantics.withEnvironment(
        environment_semantics.createDeclativeEnvironment(compute.just(scope)),
        compute.sequence(
            (id ? environment_semantics.putStrictnessMutableBinding(id, strict, compute.just(ref)) : compute.empty),
            compute.sequencea(names.map(function(x, i) {
                return environment_semantics.putStrictnessMutableBinding(x, strict, compute.just(args.getArg(i)));
            })),
            execution_context_semantics.withThisBinding(thisObj,
                body)));
};

LanguageFunction.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new LanguageFunction(
        this.proto,
        properties,
        this.scope,
        this.id,
        this.names,
        this.body,
        this.strict));
};

/* Export
 ******************************************************************************/
exports.LanguageFunction = LanguageFunction;

});