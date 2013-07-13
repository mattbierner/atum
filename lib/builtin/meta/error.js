/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/value/type',
        'atum/value/value',
        'atum/value/object',
        'atum/value/number',
        'atum/operations/value_reference'],
function(exports,
        compute,
        value_reference,
        type,
        value,
        object,
        number,
        value_reference_semantics){
//"use strict";

/* ErrorPrototype
 ******************************************************************************/
var ErrorPrototype = function(proto, props) {
    object.Object.call(this, proto, props);
};
ErrorPrototype.prototype = new object.Object;
ErrorPrototype.prototype.constructor = ErrorPrototype;

ErrorPrototype.prototype.cls = "Error";

/* Error
 ******************************************************************************/
var Error = function(proto, props) {
    object.Object.call(this, proto, props);
};
ErrorPrototype.prototype = new object.Object;
ErrorPrototype.prototype.constructor = ErrorPrototype;



/* Export
 ******************************************************************************/
exports.ErrorPrototype = ErrorPrototype;
exports.Error = Error;

});