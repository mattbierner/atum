/**
 * @fileOverview Meta hosted function object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/value/object',
        'atum/value/value',
        'atum/operations/value_reference'],
function(exports,
        compute,
        value_reference,
        object,
        value,
        value_reference_semantics){
//"use strict";

/* Function
 ******************************************************************************/
/**
 * Meta object for a hosted function.
 */
var Function = function(proto, props) {
    object.Object.call(this, proto, props);
};
Function.prototype = new object.Object;

Function.prototype.cls = "Function";

/**
 */
Function.prototype.construct = function(args) {
    var builtin_object = require('atum/builtin/object');
    var meta_object = require('atum/builtin/meta/object');
    var that = this;
    return compute.bind(this.get(null, 'prototype'), function(proto) {
        proto = (proto && proto instanceof value_reference.ValueReference ? proto : builtin_object.ObjectPrototype);
        
        var obj = new meta_object.Object(proto, {});
        return compute.bind(
            value_reference_semantics.create(obj),
            function(ref) {
                return compute.bind(that.call(that, ref, args), function(result) {
                    return compute.just(result instanceof value_reference.ValueReference ?
                        result :
                        ref);
                });
            });
    });
};

/* Export
 ******************************************************************************/
exports.Function = Function;

});