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
var Object = record.extend(meta_base.Base, []);

Object.prototype.cls = "Object";

/* Export
 ******************************************************************************/
exports.Object = Object;

});