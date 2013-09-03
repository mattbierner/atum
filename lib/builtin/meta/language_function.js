/**
 * 
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/meta/func',
        'atum/operations/args',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/func',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/value/type',
        'atum/value/value',],
function(exports,
        amulet_object,
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
                execution_context.getThisBinding(),
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
    
    return compute.bind(
        bargs.createArgumentsObject(ref, names, args, scope, strict),
        function(a) {
            return environment.withEnvironment(
                environment.createDeclativeEnvironment(scope),
                compute.sequence(
                    (id ? environment.putStrictnessMutableBinding(id, strict, compute.just(ref)) : compute.empty),
                    environment.putStrictnessImmutableBinding('arguments', strict, compute.just(a)),
                    compute.sequencea(names.map(function(x, i) {
                        return environment.putStrictnessMutableBinding(x, strict, compute.just(args.getArg(i)));
                    })),
                    execution_context.withThisBinding(thisObj,
                        body)));
    });
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