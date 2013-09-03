/**
 * @fileOverview Hosted number object meta.
 */
define(['exports',
        'amulet/object',
        'atum/builtin/meta/primitive_box',
        'atum/value/string'],
function(exports,
        amulet_object,
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

String.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new String(
        this.proto,
        properties,
        this.primitiveValue));
};

/* Export
 ******************************************************************************/
exports.String = String;

});