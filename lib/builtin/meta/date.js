/**
 * @fileOverview Date meta
 */
define(['exports',
        'amulet/record',
        'atum/builtin/meta/object'],
function(exports,
        record,
        meta_object){
"use strict";

/* Date
 ******************************************************************************/
/**
 * Date object meta
 */
var Date = record.extend(meta_object.Object, [
    'primitiveValue']);

/* Export
 ******************************************************************************/
exports.Date = Date;

});