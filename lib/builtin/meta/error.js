/**
 * @fileOverview Error meta
 */
define(['exports',
        'atum/builtin/meta/object'],
function(exports,
        meta_object){
"use strict";

/* Error
 ******************************************************************************/
/**
 * Error meta
 */
var Error = function(proto, props) {
    meta_object.Object.call(this, proto, props);
};
Error.prototype = new meta_object.Object;
Error.prototype.constructor = Error;

Error.prototype.cls = "Error";

Error.prototype.setProperties = function(properties) {
    return new Error(this.proto, properties);
};

Error.prototype.setPrototype = function(proto) {
    return new Error(proto, this.properties);
};

/* Export
 ******************************************************************************/
exports.Error = Error;

});