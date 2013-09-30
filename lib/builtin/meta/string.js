/**
 * @fileOverview String object meta
 */
define(['exports',
        'atum/builtin/meta/primitive_box',
        'atum/value/property',
        'atum/value/string'],
function(exports,
        primitive_box,
        property,
        string){
"use strict";

var isStringIndex = function(name) {
    return !isNaN(name) && +name >= 0 && "" + Math.abs(Math.round(name)) === name;
};

/* String
 ******************************************************************************/
/**
 * String object meta
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

String.prototype.setPrototype = function(proto) {
    return new String(proto, this.properties, this.primitiveValue);
};

String.prototype.getOwnPropertyNames = function() {
    return primitive_box.PrimitiveBox.prototype.getOwnPropertyNames.call(this).concat(
        string.indicies(this.primitiveValue),
        'length');
};

String.prototype.getOwnProperty = function(name) {
    var desc = primitive_box.PrimitiveBox.prototype.getOwnProperty.call(this, name);
    if (desc)
        return desc;
    
    if (name === 'length') {
        return property.createValuePropertyFlags(
            string.length(this.primitiveValue));
    } else if (isStringIndex(name)) {
        var len = this.primitiveValue.value.length;
        if (name < len)
            return property.createValuePropertyFlags(
                string.charAt(this.primitiveValue, name),
                property.ENUMERABLE);
    }
    return null;
};

/* Export
 ******************************************************************************/
exports.String = String;

});