/**
 * @fileOverview Hosted boolean object meta object.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/value/boolean'],
function(exports,
        amulet_object,
        compute,
        meta_object,
        boolean){
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Hosted Boolean object meta.
 */
var Boolean = function(proto, props, primitiveValue) {
    meta_object.Object.call(this, proto, props);
    this.primitiveValue = (primitiveValue || boolean.FALSE);
};
Boolean.prototype = new meta_object.Object;
Boolean.prototype.constructor = Boolean; 

Boolean.prototype.cls = "Boolean";

Boolean.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

Boolean.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new Boolean(
        this.proto,
        properties,
        this.primitiveValue));
};

/* Export
 ******************************************************************************/
exports.Boolean = Boolean;

});