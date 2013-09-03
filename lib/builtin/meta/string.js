/**
 * @fileOverview Hosted number object meta.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/value/string'],
function(exports,
        amulet_object,
        compute,
        meta_object,
        string){
"use strict";

/* String
 ******************************************************************************/
/**
 * Hosted String object meta.
 */
var String = function(proto, props, primitiveValue) {
    meta_object.Object.call(this, proto, props);
    this.primitiveValue = (primitiveValue || string.EMPTY);
};
String.prototype = new meta_object.Object;
String.prototype.constructor = String; 

String.prototype.cls = "String";

/**
 * 
 */
String.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

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