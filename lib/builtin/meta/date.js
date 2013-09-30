/**
 * @fileOverview Date meta
 */
define(['exports',
        'atum/builtin/meta/object'],
function(exports,
        meta_object){
"use strict";

/* Date
 ******************************************************************************/
/**
 * Date object meta
 */
var Date = function(proto, props, primitiveValue) {
    meta_object.Object.call(this, proto, primitiveValue);
    this.primitiveValue = primitiveValue;
};
Date.prototype = new meta_object.Object;
Date.prototype.constructor = Date; 

Date.prototype.setProperties = function(properties) {
    return new Date(this.proto, properties, this.primitiveValue);
};

Date.prototype.setPrototype = function(proto) {
    return new Date(proto, this.properties, this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.Date = Date;

});