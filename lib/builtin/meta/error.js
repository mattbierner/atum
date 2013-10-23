/**
 * @fileOverview Error meta
 */
define(['exports',
        'amulet/record',
        'atum/builtin/meta/object'],
function(exports,
        record,
        meta_object){
"use strict";

/* Error
 ******************************************************************************/
/**
 * Error meta
 */
var Error = record.declare(new meta_object.Object, [
    'proto',
    'properties']);

Error.prototype.cls = "Error";

/* Export
 ******************************************************************************/
exports.Error = Error;

});