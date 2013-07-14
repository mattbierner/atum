/**
 * @fileOverview
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/value/number'],
function(exports,
        compute,
        meta_object,
        number){
//"use strict";

/* Number
 ******************************************************************************/
var Number = function(proto, props, primitiveValue) {
    meta_object.Object.call(this, proto, props);
    this.primitiveValue = primitiveValue || new number.Number(0);
};
Number.prototype = new meta_object.Object;
Number.prototype.constructor = Number; 

Number.prototype.cls = "Number";

Number.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

/* Export
 ******************************************************************************/
exports.Number = Number;

});