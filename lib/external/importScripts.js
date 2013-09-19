/**
 * @fileOverview Builtin `Function` object values.
 */
define(['atum/compute',
        'atum/value_reference',
        'atum/operations/evaluation',
        'atum/operations/type_conversion'],
function(compute,
        value_reference,
        evaluation,
        type_conversion){
"use strict";

var ref = new value_reference.ValueReference();

var importScripts = function(ref, thisObj, args) {
    if (args.length === 0)
        return error.typeError();
    
    return compute.bind(
        type_conversion.toString(args.getArg(0)),
        function(name) {
            return evaluation.evaluateUrlFile(name.value);
        });
};

var initialize = function(mutableBinding, immutableBinding) {
    var builtin_function = require('atum/builtin/builtin_function');
    return compute.sequence(
        builtin_function.create(ref, 'importScripts', 1, importScripts),
        mutableBinding('importScripts', ref));
};

/* Exports
 ******************************************************************************/
return {
    'importScripts': ref,
    'initialize': initialize
};

});