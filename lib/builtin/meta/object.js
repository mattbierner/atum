/**
 * @fileOverview Hosted object meta.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/meta/base',
        'atum/operations/error',
        'atum/operations/func',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/object', 
        'atum/value/value'],
function(exports,
        compute,
        vr,
        meta_base,
        error,
        func,
        object_operations,
        value_reference,
        object,
        value){
"use strict";

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function(proto, properties) {
    meta_base.Base.call(this, proto, properties);
};
Object.prototype = new meta_base.Base;
Object.prototype.constructor = Object;

Object.prototype.cls = "Object";

Object.prototype.setProperties = function(properties) {
    return new Object(this.proto, properties);
};

Object.prototype.setPrototype = function(proto) {
    return new Object(proto, this.properties);
};

/* Export
 ******************************************************************************/
exports.Object = Object;

});