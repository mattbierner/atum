/**
 * @fileOverview Number object meta
 */
define(['exports',
        'amulet/record',
        'atum/builtin/meta/primitive_box',
        'atum/value/number'],
function(exports,
        record,
        primitive_box,
        number){
"use strict";

/* Number
 ******************************************************************************/
/**
 * Number object meta
 */
var Number = record.extend(primitive_box.PrimitiveBox, [],
    function(proto, props, extensible, primitiveValue) {
        primitive_box.PrimitiveBox.call(
            this,
            proto,
            props,
            extensible,
            (primitiveValue || number.ZERO));
    });

Number.prototype.cls = "Number";

/* Export
 ******************************************************************************/
exports.Number = Number;

});