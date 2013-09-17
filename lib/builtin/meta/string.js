/**
 * @fileOverview Hosted number object meta.
 */
define(['exports',
        'atum/builtin/meta/primitive_box',
        'atum/value/number',
        'atum/value/property',
        'atum/value/string'],
function(exports,
        primitive_box,
        number,
        property,
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

String.prototype.getOwnPropertyNames = function() {
    var names = primitive_box.PrimitiveBox.prototype.getOwnPropertyNames.call(this);
    for (var i = 0; i < this.primitiveValue.value.length; ++i)
        names.push(i + '');
    names.push('length');
    return names;
};

String.prototype.getOwnProperty = function(name) {
    var desc = primitive_box.PrimitiveBox.prototype.getOwnProperty.call(this, name);
    if (desc)
        return desc;
    
    if (name === 'length') {
        return property.createValueProperty(
            new number.Number(this.primitiveValue.value.length),
            false,
            false,
            false);
    } else if (isStringIndex(name)) {
        var len = this.primitiveValue.value.length;
        if (name < len)
            return property.createValueProperty(
                new string.String(this.primitiveValue.value[name]),
                true,
                false,
                false);
    }
    return null;
};

/* Export
 ******************************************************************************/
exports.String = String;

});