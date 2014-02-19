/**
 * @fileOverview Boolean object meta
 */
define(['exports',
        'bes/record',
        'atum/builtin/meta/primitive_box',
        'atum/value/boolean'],
function(exports,
        record,
        primitive_box,
        boolean){
"use strict";

/* Boolean
 ******************************************************************************/
/**
 * Boolean object meta
 */
var Boolean = record.extend(primitive_box.PrimitiveBox,
    [])

Boolean.prototype.cls = "Boolean";

/* Export
 ******************************************************************************/
exports.Boolean = Boolean;

});