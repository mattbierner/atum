/**
 * @fileOverview Hosted boolean object meta object.
 */
define(['exports',
        'amulet/object',
        'atum/builtin/meta/primitive_box',
        'atum/value/boolean'],
function(exports,
        amulet_object,
        primitive_box,
        boolean){
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Hosted Boolean object meta.
 */
var Boolean = function(proto, props, primitiveValue) {
    primitive_box.PrimitiveBox.call(
        this,
        proto,
        props,
        (primitiveValue || boolean.FALSE));
};
Boolean.prototype = new primitive_box.PrimitiveBox;
Boolean.prototype.constructor = Boolean; 

Boolean.prototype.cls = "Boolean";

Boolean.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new Number(
        this.proto,
        properties,
        this.primitiveValue));
};

/* Export
 ******************************************************************************/
exports.Boolean = Boolean;

});