/**
 * @fileOverview Language function meta
 */
define(['exports',
        'bes/record',
        'atum/compute',
        'atum/fun',
        'atum/builtin/meta/func',
        'atum/operations/declaration_binding',
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
        declaration_bindings,
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

LanguageFunction.prototype._call = function(ref, thisObj, args) {
    var self = this;
    return environment.environmentBlock(
        compute.sequence(
            compute.bind(
                environment.createDeclativeEnvironment(self.scope),
                function(env) {
                    return declaration_bindings.initFunction(env,
                        self.strict,
                        ref,
                        self.id,
                        self.names,
                        args,
                        self.declarations);
                }),
            execution_context.withThisBinding(thisObj,
                self.body)));
};

LanguageFunction.prototype.call = function(ref, thisObj, args) {
    var self = this, strict = this.strict;
    return value_reference.dereference(thisObj, function(t, thisObj) {
        if (!strict && !value.isObject(t)) {
            switch (t.type) {
            case type.UNDEFINED:
            case type.NULL:
                return compute.bind(
                    execution_context.thisBinding,
                    function(t) {
                        return self._call(ref, t, args);
                    });
            case type.STRING:
            case type.NUMBER:
            case type.BOOLEAN:
                return compute.bind(
                    type_conversion.toObject(thisObj),
                    function(t) {
                        return func.forward(ref, t, args);
                    });
            }
        }
        return self._call(ref, thisObj, args);
    });
};

/* Export
 ******************************************************************************/
exports.LanguageFunction = LanguageFunction;

});