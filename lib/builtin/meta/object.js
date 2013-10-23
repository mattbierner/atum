/**
 * @fileOverview Object meta
 */
define(['exports',
        'amulet/record',
        'atum/builtin/meta/base'],
function(exports,
        record,
        meta_base){
"use strict";

/* Object
 ******************************************************************************/
/**
 * Object meta
 */
var Object = record.declare(new meta_base.Base, [
    'proto',
    'properties']);

Object.prototype.cls = "Object";

/* Export
 ******************************************************************************/
exports.Object = Object;

});