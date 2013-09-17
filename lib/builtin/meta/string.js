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

var isStringIndex = function(name) {
    return !isNaN(name) && +name >= 0 && "" + Math.abs(Math.round(name)) === name;
};

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

String.prototype.hasOwnProperty = function(name) {
    return primitive_box.PrimitiveBox.prototype.hasOwnProperty.call(this, name) ||
        (isStringIndex(name) && name < this.primitiveValue.value.length);
};

String.prototype.getOwnProperty = function(name) {
    var desc = primitive_box.PrimitiveBox.prototype.getOwnProperty.call(this, name);
    if (desc)
        return desc;
    
    if (isStringIndex(name)) {
        var len = this.primitiveValue.value.length;
        if (name < len)
            return {
                'value': new string.String(this.primitiveValue.value[name]),
                'enumerable': true,
                'writable': false,
                'configurable': false
            };
    }
    return null;
};

String.prototype.getEnumerableProperties = function() {
    var properties = primitive_box.PrimitiveBox.prototype.getEnumerableProperties.call(this);
    for (var i = 0; i < this.primitiveValue.value.length; ++i)
        properties.push(i + '');
    return properties;
};


/* Export
 ******************************************************************************/
exports.String = String;

});