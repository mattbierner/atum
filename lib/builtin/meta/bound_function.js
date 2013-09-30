/**
 * @fileOverview Bound function meta
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/func',
        'atum/operations/func',
        'atum/operations/object'],
function(exports,
        compute,
        meta_func,
        func,
        object){
"use strict";

/* BoundFunction
 ******************************************************************************/
/**
 * Meta object for a function with bound a this object and set of bound arguments.
 * 
 * @param proto Object prototype.
 * @param props Object properties.
 * @param target Reference the function being bound.
 * @param boundThis The this object used for calling the bound function.
 * @param boundArgs Arguments forwarded to the bound function.
 */
var BoundFunction = function(proto, props, target, boundThis, boundArgs) {
    meta_func.Function.call(this, proto, props);
    this.target = target;
    this.boundThis = boundThis;
    this.boundArgs = boundArgs;
};
BoundFunction.prototype = new meta_func.Function;
BoundFunction.prototype.constructor = BoundFunction;

BoundFunction.prototype.setProperties = function(properties) {
    return new BoundFunction(
        this.proto,
        properties,
        this.target,
        this.boundThis,
        this.boundArgs);
};

BoundFunction.prototype.setPrototype = function(proto) {
    return new BoundFunction(
        proto,
        this.properties,
        this.target,
        this.boundThis,
        this.boundArgs);
};

BoundFunction.prototype.construct = function(ref, args) {
    return object.construct(
        this.target,
        this.boundArgs.concat(args).args);
};

BoundFunction.prototype.call = function(ref, thisObj, args) {
    return func.apply(
        this.target,
        this.boundThis,
        this.boundArgs.concat(args));
};

BoundFunction.prototype.hasInstance = function(ref, v) {
    return object.hasInstance(this.target, v);
};

/* Export
 ******************************************************************************/
exports.BoundFunction = BoundFunction;

});