/**
 * @fileOverview Boolean object meta
 */
define(['exports',
        'atum/builtin/meta/primitive_box',
        'atum/value/boolean',
        'atum/value/type'],
function(exports,
        primitive_box,
        boolean,
        type){
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Boolean object meta
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
Boolean.prototype.preferedType = type.STRING;

Boolean.prototype.setProperties = function(properties) {
    return new Boolean(this.proto, properties, this.primitiveValue);
};

Boolean.prototype.setPrototype = function(proto) {
    return new Boolean(proto, this.properties, this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.Boolean = Boolean;

});