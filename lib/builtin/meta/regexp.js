/**
 * @fileOverview Hosted regular expression object meta.
 */
define(['exports',
        'amulet/object',
        'atum/builtin/meta/object'],
function(exports,
        amulet_object,
        meta_object){
"use strict";

/* RegExp
 ******************************************************************************/
/**
 * Hosted regular expression object meta.
 */
var RegExp = function(proto, props, pattern) {
    meta_object.Object.call(this, proto, props);
    this.pattern = pattern;
};
RegExp.prototype = new meta_object.Object;
RegExp.prototype.constructor = RegExp; 

RegExp.prototype.cls = "RegExp";

RegExp.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new RegExp(
        this.proto,
        properties,
        this.primitiveValue));
};

/* Export
 ******************************************************************************/
exports.RegExp = RegExp;

});