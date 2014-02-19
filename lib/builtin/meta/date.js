/**
 * @fileOverview Date meta
 */
define(['exports',
        'bes/record',
        'atum/builtin/meta/object',
        'atum/value/type'],
function(exports,
        record,
        meta_object,
        type){
"use strict";

/* Date
 ******************************************************************************/
/**
 * Date object meta
 */
var Date = record.extend(meta_object.Object, [
    'primitiveValue'],
    function(proto, props, extensible, primitiveValue) {
        meta_object.Object.call(this, proto, props, extensible);
        this.primitiveValue = primitiveValue;
    });

Date.prototype.preferedType = type.STRING;


/* Export
 ******************************************************************************/
exports.Date = Date;

});