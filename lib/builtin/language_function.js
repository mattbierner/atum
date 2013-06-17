/**
 * 
 */
define(['amulet/object',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/builtin/func',
        'atum/context/environment',
        'atum/value/type',
        'atum/value/value',
        'atum/builtin/object',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/internal_reference',
        'atum/operations/type_conversion',
        'atum/operations/undef'],
function(amulet_object,
        compute,
        value_reference,
        builtin_object,
        func,
        environment,
        type,
        value,
        builtin_object,
        environment_semantics,
        execution_context_semantics,
        internal_reference,
        type_conversion,
        undef){
//"use strict";

/* LanguageFunction
 ******************************************************************************/
/**
 * Meta object class for a hosted language function from code.
 */
var LanguageFunction = function(scope, id, names, body, strict) {
    func.FunctionPrototype.call(this);
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
            return compute.bind(type_conversion.toObject(compute.always(thisObj)), function(thisObj) {
                return that.call(ref, thisObj, args);
            });
        }
    }
    
    var strict = this.strict,
        names = this.names,
        scope = this.scope,
        body = this.body,
        id = this.id,
        that = this;
    return compute.bind(
        environment_semantics.createEnvironment(new environment.DeclarativeLexicalEnvironment(scope)),
        function(e) {
            return environment_semantics.withEnvironment(e,
                execution_context_semantics.withThisBinding(thisObj,
                    compute.next(
                        (id ? environment_semantics.putMutableBinding(id, strict, compute.always(that)) : compute.empty),
                        names.reduceRight(function(p, c, i) {
                            var v = (i >= args.length ? undef.create() : compute.always(args[i]));
                            return compute.next(
                                environment_semantics.putMutableBinding(c, strict, v),
                                p);
                        }, body))));
        });
};

LanguageFunction.prototype.defineProperty = function(name, desc) {
    var obj = new LanguageFunction(this.scope, this.id, this.names, this.body, this.strict);
    obj.properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return obj;
};

/* Export
 ******************************************************************************/
return {
    'LanguageFunction': LanguageFunction,
};

});