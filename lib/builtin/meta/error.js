/**
 * @fileOverview
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object'],
function(exports,
        amulet_object,
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

Error.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new Error(
        this.proto,
        properties));
};

/* Export
 ******************************************************************************/
exports.Error = Error;

});