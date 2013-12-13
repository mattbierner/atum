/**
 * @fileOverview Primitive Box meta
 */
define(['exports',
        'amulet/record',
        'atum/compute',
        'atum/builtin/meta/object'],
function(exports,
        record,
        compute,
        meta_object){
"use strict";

/* PrimitiveBox
 ******************************************************************************/
/**
 * Boxed primitive value abstract base object meta
 */
var PrimitiveBox = record.extend(meta_object.Object, [
    'primitiveValue'],
    function(proto, props, extensible, primitiveValue) {
        meta_object.Object.call(this, proto, props, extensible);
        this.primitiveValue = primitiveValue;
    });

PrimitiveBox.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.PrimitiveBox = PrimitiveBox;

});