/**
 * @fileOverview Arguments meta object
 */
define(['exports',
        'amulet/record',
        'atum/builtin/meta/object'],
function(exports,
        record,
        meta_object){
"use strict";

/* Arguments
 ******************************************************************************/
/**
 * Arguments meta
 */
var Arguments = record.extend(meta_object.Object, [
    'func',
    'names',
    'args',
    'env',
    'strict']);

Arguments.prototype.cls = "Arguments";

/* Export
 ******************************************************************************/
exports.Arguments = Arguments;

});