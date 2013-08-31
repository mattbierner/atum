/**
 * @fileOverview Bound function meta object.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/func',
        'atum/operations/environment',
        'atum/operations/execution_context',
        'atum/operations/func',
        'atum/operations/type_conversion',
        'atum/operations/undef',
        'atum/operations/value_reference',
        'atum/value/type',
        'atum/value/value',],
function(exports,
        amulet_object,
        compute,
        meta_func,
        environment,
        execution_context,
        func,
        type_conversion,
        undef,
        value_reference,
        type,
        value){
//"use strict";

/* BoundFunction
 ******************************************************************************/
/**
 * Meta object class for a hosted language function from code.
 */
var BoundFunction = function(proto, props, target, boundThis, boundArgs) {
    meta_func.Function.call(this, proto, props);
    this.target = target;
    this.boundThis = boundThis;
    this.boundArgs = boundArgs;
};
BoundFunction.prototype = new meta_func.Function;
BoundFunction.prototype.constructor = BoundFunction;

/**
 * 
 */
BoundFunction.prototype.construct = function(ref, args) {
    return this.target.construct(
        ref,
        args.concat(this.boundArgs))
};

/**
 * 
 */
BoundFunction.prototype.call = function(ref, thisObj, args) {
    var boundThis = this.boundThis, boundArgs = this.boundArgs;
    debugger;
    return compute.bind(
        value_reference.getValue(compute.just(this.target)),
        function(target) {
            return target.call(
                ref,
                boundThis,
                args.concat(boundArgs));
            
        });
    
    return func.call(
            compute.just(this.target),
        compute.just(this.boundThis),
        compute.enumerationa(args.concat(this.boundArgs).args.map(compute.just)));
};

BoundFunction.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new BoundFunction(
        this.proto,
        properties,
        this.target,
        this.boundThis,
        this.boundArgs));
};

/* Export
 ******************************************************************************/
exports.BoundFunction = BoundFunction;

});