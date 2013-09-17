/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/object'],
function(exports,
        compute,
        meta_object){
"use strict";

/* Error
 ******************************************************************************/
var Error = function(proto, props) {
    meta_object.Object.call(this, proto, props);
};
Error.prototype = new meta_object.Object;
Error.prototype.constructor = Error;

Error.prototype.cls = "Error";

Error.prototype.setProperties = function(properties) {
    return new Error(this.proto, properties);
};

/* Export
 ******************************************************************************/
exports.Error = Error;

});