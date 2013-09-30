/**
 * @fileOverview Number object meta
 */
define(['exports',
        'atum/builtin/meta/primitive_box',
        'atum/value/number'],
function(exports,
        primitive_box,
        number){
"use strict";

/* Number
 ******************************************************************************/
/**
 * Number object meta
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

Number.prototype.setProperties = function(properties) {
    return new Number(this.proto, properties, this.primitiveValue);
};

Number.prototype.setPrototype = function(proto) {
    return new Number(proto, this.properties, this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.Number = Number;

});