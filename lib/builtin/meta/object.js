/**
 * @fileOverview Hosted object meta.
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/operations/value_reference',
        'atum/value/object', 
        'atum/value/value'],
function(exports,
        amulet_object,
        compute,
        value_reference_semantics,
        object,
        value){
"use strict";

/* Object
 ******************************************************************************/
/**
 * 
 */
var Object = function(proto, properties) {
    object.Object.call(this, proto, properties);
};
Object.prototype = new object.Object;
Object.prototype.constructor = Object;

Object.prototype.cls = "Object";

Object.prototype.defaultValue = function(ref, hint) {
    var thisToString = this.get(ref, "toString"),
        thisValueOf = this.get(ref, "valueOf");
    
    var toString = value_reference_semantics.getValue(thisToString),
        valueOf = value_reference_semantics.getValue(thisValueOf);
    
    switch (hint)
    {
    case 'String':
        return compute.bind(toString, function(toStringImpl) {
            if (toStringImpl && value.isCallable(toStringImpl)) {
                return toStringImpl.call(thisToString, ref, []);
            }
            return compute.bind(valueOf, function(valueOfImpl) {
                return valueOf.call(thisValueOf, ref, []);
            });
        });
    case 'Number':
    default:
         return compute.bind(valueOf, function(valueOfImpl) {
            if (valueOfImpl && value.isCallable(valueOfImpl)) {
                return valueOfImpl.call(thisValueOf, ref, []);
            }
            return compute.bind(toString, function(toStringImpl) {
                return toStringImpl.call(thisToString, ref, []);
            });
        });
    }
};

Object.prototype.defineProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true
    });
    return ref.setValue(new Object(
        this.proto,
        properties));
};

/* Export
 ******************************************************************************/
exports.Object = Object;

});