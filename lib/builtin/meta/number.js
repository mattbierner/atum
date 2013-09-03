/**
 * @fileOverview Hosted number object meta.
 */
define(['exports',
        'amulet/object',
        'atum/builtin/meta/primitive_box',
        'atum/value/number'],
function(exports,
        amulet_object,
        primitive_box,
        number){
"use strict";

/* Number
 ******************************************************************************/
/**
 * Hosted Number object meta.
 */
var Number = function(proto, props, primitiveValue) {
    primitive_box.PrimitiveBox.call(
        this,
        proto,
        props,
        (primitiveValue || number.ZERO));
};
Number.prototype = new primitive_box.PrimitiveBox;
Number.prototype.constructor = Number; 

Number.prototype.cls = "Number";

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