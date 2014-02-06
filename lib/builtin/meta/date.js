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
    'primitiveValue']);

Date.prototype.preferedType = type.STRING;


/* Export
 ******************************************************************************/
exports.Date = Date;

});