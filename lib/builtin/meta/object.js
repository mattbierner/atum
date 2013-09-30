/**
 * @fileOverview Object meta
 */
define(['exports',
        'atum/builtin/meta/base'],
function(exports,
        meta_base){
"use strict";

/* Object
 ******************************************************************************/
/**
 * Object meta
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