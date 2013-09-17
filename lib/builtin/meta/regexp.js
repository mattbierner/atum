/**
 * @fileOverview Hosted regular expression object meta.
 */
define(['exports',
        'atum/builtin/meta/object'],
function(exports,
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

RegExp.prototype.setProperties = function(properties) {
    return new RegExp(this.proto, properties, this.pattern);
};

/* Export
 ******************************************************************************/
exports.RegExp = RegExp;

});