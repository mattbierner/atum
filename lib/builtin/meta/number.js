/**
 * @fileOverview Hosted number object meta.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/value/number'],
function(exports,
        amulet_object,
        compute,
        meta_object,
        number){
"use strict";

/* Number
 ******************************************************************************/
/**
 * Hosted Number object meta.
 */
var Number = function(proto, props, primitiveValue) {
    meta_object.Object.call(this, proto, props);
    this.primitiveValue = (primitiveValue || number.ZERO);
};
Number.prototype = new meta_object.Object;
Number.prototype.constructor = Number; 

Number.prototype.cls = "Number";

/**
 * 
 */
Number.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

Number.prototype.defineProperty = function(ref, name, desc) {
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
exports.Number = Number;

});