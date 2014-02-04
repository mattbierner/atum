/**
 * @fileOverview Language function meta
 */
define(['exports',
        'bes/record',
        'atum/compute',
        'atum/fun',
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
        record,
        compute,
        fun,
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
var LanguageFunction = record.extend(meta_func.Function, [
    'scope',
    'strict',
    'id',
    'names',
    'code',
    'declarations',
    'body']);

LanguageFunction.prototype.call = (function(){
    var impl = function(ref, thisObj, args, code, id, scope, strict, names, body) {
        return environment.environmentBlock(
            compute.sequence(
                compute.bind(
                    environment.createDeclativeEnvironment(scope),
                    environment.setEnvironment),
                (id ? environment.putStrictnessImmutableBinding(strict, id, ref) : compute.empty),
                compute.bind(
                    bargs.createCurrentEnvironment(ref, names, args, strict),
                    fun.curry(environment.putStrictnessImmutableBinding, strict, 'arguments')),
                this.declarations,
                compute.sequencea(fun.map(function(x, i) {
                    return environment.putStrictnessMutableBinding(strict, x, args.getArg(i));
                }, names)),
                execution_context.withThisBinding(thisObj, this.body)));
    };
   
    return function(ref, thisObj, args) {
        var self = this,
            body = this.body,
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
                        return impl.call(self, ref, t, args, body, id, scope, strict, names);
                    });
                case type.STRING:
                case type.NUMBER:
                case type.BOOLEAN:
                    return compute.bind(type_conversion.toObject(thisObj), function(t) {
                        return func.forward(ref, t, args);
                    });
                }
            }
            return impl.call(self, ref, thisObj, args, body, id, scope, strict, names);
        });
    };
}());

/* Export
 ******************************************************************************/
exports.LanguageFunction = LanguageFunction;

});