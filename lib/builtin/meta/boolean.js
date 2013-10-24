/**
 * @fileOverview Boolean object meta
 */
define(['exports',
        'amulet/record',
        'atum/builtin/meta/primitive_box',
        'atum/value/boolean',
        'atum/value/type'],
function(exports,
        record,
        primitive_box,
        boolean,
        type){
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Boolean object meta
 */
var Boolean = record.extend(primitive_box.PrimitiveBox, [],
    function(proto, props, extensible, primitiveValue) {
        primitive_box.PrimitiveBox.call(
            this,
            proto,
            props,
            extensible,
            (primitiveValue || boolean.FALSE));
    });

Boolean.prototype.cls = "Boolean";
Boolean.prototype.preferedType = type.STRING;

/* Export
 ******************************************************************************/
exports.Boolean = Boolean;

});