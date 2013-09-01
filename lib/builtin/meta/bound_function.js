/**
 * @fileOverview Bound function meta object.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/func',
        'atum/operations/func',
        'atum/operations/object'],
function(exports,
        amulet_object,
        compute,
        meta_func,
        func,
        object){
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
    return object.construct(
        compute.just(this.target),
        compute.enumerationa(this.boundArgs.concat(args).args.map(compute.just)));
};

/**
 * 
 */
BoundFunction.prototype.call = function(ref, thisObj, args) {
    return func.call(
        compute.just(this.target),
        compute.just(this.boundThis),
        compute.enumerationa(this.boundArgs.concat(args).args.map(compute.just)));
};

/**
 * 
 */
BoundFunction.prototype.hasInstance = function(ref, v) {
    return object.hasInstance(
        compute.just(this.target),
        compute.just(v));
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