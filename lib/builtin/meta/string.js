/**
 * @fileOverview Hosted number object meta.
 */
define(['exports',
        'atum/builtin/meta/primitive_box',
        'atum/value/string'],
function(exports,
        primitive_box,
        string){
"use strict";

/* String
 ******************************************************************************/
/**
 * Hosted String object meta.
 */
var String = function(proto, props, primitiveValue) {
    primitive_box.PrimitiveBox.call(
        this,
        proto,
        props,
        (primitiveValue || string.EMPTY));
};
String.prototype = new primitive_box.PrimitiveBox;
String.prototype.constructor = String; 

String.prototype.cls = "String";

String.prototype.setProperties = function(properties) {
    return new String(this.proto, properties, this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.String = String;

});