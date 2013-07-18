/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/object'],
function(exports,
        compute,
        meta_object){
//"use strict";

/* Error
 ******************************************************************************/
var Array = function(proto, props) {
    meta_object.Object.call(this, proto, props);
};
Array.prototype = new meta_object.Object;
Array.prototype.constructor = Array;

Array.prototype.cls = "Array";

Array.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return new Number(
        this.proto,
        properties,
        this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.Array = Array;

});