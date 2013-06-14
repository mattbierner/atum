/**
 * @fileOverview
 */
define(['atum/compute',
        'atum/value/type',
        'atum/value/value',
        'atum/value/object',
        'atum/operations/value_reference'],
function(compute,
        type,
        value,
        object,
        value_reference){
//"use strict";

/* Function
 ******************************************************************************/
/**
 * 
 */
var Function = function() {
    object.Object.call(this);
};

Function.prototype = new object.Object;

/**
 * 
 */
Function.prototype.call = null;

/**
 * Internal function object construction
 * 
 * @TODO: hookup default object prototype.
 */
Function.prototype.construct = function(args) {
    var proto = (this.proto && value.type(this.proto) === type.OBJECT_TYPE ? 
        this.proto :
        object.ObjectPrototypeRef);
    
    var obj = amulet_object.defineProperty(new object.Object(proto), 'Class', {
        'value': 'Object',
        'extensible': true
    });
    var that = this;
    return compute.bind(
        value_reference.create(compute.always(obj)),
        function(ref) {
            return compute.next(
                that.call(ref, args),
                compute.always(ref));
        });

};

/* Export
 ******************************************************************************/
return {
    'Function': Function,
};

});