/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/error'],
function(exports,
        compute,
        meta_error){
//"use strict";

/* ErrorPrototype
 ******************************************************************************/
var NativeErrorPrototype = function(proto, props) {
    meta_error.ErrorPrototype.call(this, proto, props);
};
NativeErrorPrototype.prototype = new meta_error.ErrorPrototype;
NativeErrorPrototype.prototype.constructor = NativeErrorPrototype;

/* NativeError
 ******************************************************************************/
var NativeError = function(proto, props) {
    meta_error.Error.call(this, proto, props);
};
NativeError.prototype = new meta_error.Error;
NativeError.prototype.constructor = NativeError;



/* Export
 ******************************************************************************/
exports.NativeError = NativeError;
exports.NativeErrorPrototype = NativeErrorPrototype;


});