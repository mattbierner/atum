/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/meta/object',
        'atum/value/type',
        'atum/value/value',
        'atum/value/object',
        'atum/value/number',
        'atum/operations/value_reference'],
function(exports,
        compute,
        value_reference,
        meta_object,
        type,
        value,
        object,
        number,
        value_reference_semantics){
//"use strict";

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function(proto, props) {
    meta_object.ObjectPrototype.call(this, proto, props);
};
ErrorPrototype.prototype = new meta_object.ObjectPrototype;
ErrorPrototype.prototype.constructor = ErrorPrototype;

ErrorPrototype.prototype.cls = "Error";

/* Error
 ******************************************************************************/
var Error = function(proto, props) {
    object.Object.call(this, proto, props);
};
Error.prototype = new object.Object;
Error.prototype.constructor = ErrorPrototype;

/* Export
 ******************************************************************************/
exports.ErrorPrototype = ErrorPrototype;
exports.Error = Error;

});