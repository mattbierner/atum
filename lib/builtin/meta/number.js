/**
 * @fileOverview The builtin Number object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/meta/object',
        'atum/operations/string',
        'atum/operations/type_conversion',
        'atum/operations/value_reference',
        'atum/value/number',
        'atum/value/object',
        'atum/value/type',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        meta_object,
        string,
        type_conversion,
        value_reference_operations,
        number,
        object,
        type,
        value){
//"use strict";

/* NumberPrototype
 ******************************************************************************/
var NumberPrototype = function(primitiveValue) {
    meta_object.ObjectPrototype.call(this, this.proto, this.properties);
    this.primitiveValue = primitiveValue || new number.Number(0);
};
NumberPrototype.prototype = new meta_object.ObjectPrototype;
NumberPrototype.prototype.constructor = NumberPrototype; 

NumberPrototype.prototype.cls = "Number";

NumberPrototype.prototype.defaultValue = function() {
    return compute.just(this.primitiveValue);
};

/* Number
 ******************************************************************************/
/**
 * 
 */
var Number = function() {
    meta_object.ObjectPrototype.call(this, this.proto, this.properties);
};

Number.prototype = new meta_object.ObjectPrototype;
Number.prototype.constructor = Number;

/**
 * 
 */
Number.prototype.call = function(ref, thisObj, args) {
    return (args.length ?
        type_conversion.toNumber(compute.just(args[0])) :
        compute.just(new number.Number(0)));
};

/**
 * Builtin Number constructor.
 */
Number.prototype.construct = function(args) {
    return compute.bind(this.call(null, null, args), function(num) {
        return value_reference_operations.create(new NumberPrototype(num));
    });
};

/* Export
 ******************************************************************************/
exports.Number = Number;
exports.NumberPrototype = NumberPrototype;

});