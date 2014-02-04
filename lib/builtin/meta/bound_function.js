/**
 * @fileOverview Bound function meta
 */
define(['exports',
        'bes/record',
        'atum/compute',
        'atum/builtin/meta/func',
        'atum/operations/construct',
        'atum/operations/func',
        'atum/operations/object'],
function(exports,
        record,
        compute,
        meta_func,
        construct,
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
 * @param extensible Is the object extensible.
 * @param target Reference the function being bound.
 * @param boundThis The this object used for calling the bound function.
 * @param boundArgs Arguments forwarded to the bound function.
 */
var BoundFunction = record.extend(meta_func.Function, [
    'target',
    'boundThis',
    'boundArgs']);

BoundFunction.prototype.construct = function(ref, args) {
    return construct.constructForward(
        this.target,
        this.boundArgs.concat(args));
};

BoundFunction.prototype.call = function(ref, thisObj, args) {
    return func.forward(
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