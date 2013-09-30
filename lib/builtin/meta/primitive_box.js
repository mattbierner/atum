/**
 * @fileOverview Primitive Box meta
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/object'],
function(exports,
        compute,
        meta_object){
"use strict";

/* PrimitiveBox
 ******************************************************************************/
/**
 * Boxed primitive value abstract base object meta
 */
var PrimitiveBox = function(proto, props, primitiveValue) {
    meta_object.Object.call(this, proto, props);
    this.primitiveValue = primitiveValue;
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