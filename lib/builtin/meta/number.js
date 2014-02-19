/**
 * @fileOverview Number object meta
 */
define(['exports',
        'bes/record',
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
var Number = record.extend(primitive_box.PrimitiveBox,
    []);

Number.prototype.cls = "Number";

/* Export
 ******************************************************************************/
exports.Number = Number;

});