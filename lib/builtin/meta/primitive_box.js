/**
 * @fileOverview Hosted object boxing a primitive value.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/value/boolean'],
function(exports,
        amulet_object,
        compute,
        meta_object,
        boolean){
"use strict";

/* PrimitiveBox
 ******************************************************************************/
/**
 * Hosted PrimitiveBox object meta.
 */
var PrimitiveBox = function(proto, props, primitiveValue) {
    meta_object.Object.call(this, proto, props);
    this.primitiveValue = (primitiveValue || boolean.FALSE);
};
PrimitiveBox.prototype = new meta_object.Object;
PrimitiveBox.prototype.constructor = PrimitiveBox; 

PrimitiveBox.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.PrimitiveBox = PrimitiveBox;

});