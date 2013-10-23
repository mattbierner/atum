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
var Arguments = record.declare(new meta_object.Object, [
    'proto',
    'properties',
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