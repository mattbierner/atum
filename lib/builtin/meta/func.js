/**
 * 
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/value/type',
        'atum/value/value',
        'atum/value/object',
        'atum/value/number',
        'atum/operations/value_reference'],
function(exports,
        compute,
        value_reference,
        type,
        value,
        object,
        number,
        value_reference_semantics){
//"use strict";

/* FunctionPrototype
 ******************************************************************************/
var FunctionPrototype = function(proto, props) {
    object.Object.call(this, proto, props);
};
FunctionPrototype.prototype = new object.Object;

/**
 * Internal function object construction
 * 
 * @TODO: hookup default object prototype.
 */
FunctionPrototype.prototype.construct = function(args) {
    var builtin_object = require('atum/builtin/object');
    var that = this;
    return compute.bind(this.get(null, 'prototype'), function(proto) {
        proto = (proto && proto instanceof value_reference.ValueReference ? proto : builtin_object.objectPrototypeRef);
        
        var obj = new object.Object(proto);
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

/* Function
 ******************************************************************************/
/**
 * 
 */
var Function = function() {
    object.Object.call(this);
};

Function.prototype = new object.Object;
Function.prototype.constructor = Function;

/**
 */
Function.prototype.call = null;

/**
 */
Function.prototype.construct = function(args) { };

/* Export
 ******************************************************************************/
exports.Function = Function;
exports.FunctionPrototype = FunctionPrototype;

});