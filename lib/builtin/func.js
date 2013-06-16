/**
 * 
 */
define(['atum/compute',
        'atum/value_reference',
        'atum/value/type',
        'atum/value/value',
        'atum/value/object',
        'atum/value/number',
        'atum/operations/value_reference'],
function(compute,
        value_reference,
        type,
        value,
        object,
        number,
        value_reference_semantics){
//"use strict";

/* Refs
 ******************************************************************************/
var functionPrototypeRef = new value_reference.ValueReference();

var functionPrototypeCallRef = new value_reference.ValueReference();

/* FunctionPrototype
 ******************************************************************************/
var FunctionPrototype = function() {
    object.Object.call(this, this.proto, {
        'call': {
            'value': functionPrototypeCallRef
        }
    });
};
FunctionPrototype.prototype = new object.Object;

FunctionPrototype.prototype.proto = object.objectPrototypeRef;

var functionPrototypeCall = function(ref, thisObj, args) {
    return compute.bind(thisObj.getValue(), function(t) {
        if (!value.isCallable(t)) {
            return compute.error();
        }
        return t.call(ref, args[0], args.slice(1));
    });
};

/**
 * Internal function object construction
 * 
 * @TODO: hookup default object prototype.
 */
FunctionPrototype.prototype.construct = function(args) {
    var that = this;
    return compute.bind(this.get(null, 'prototype'), function(proto) {
        proto = (proto ? proto : object.ObjectPrototypeRef);
        
        var obj = new object.Object(proto);

        return compute.bind(
            value_reference_semantics.create(obj),
            function(ref) {
                return compute.next(
                    that.call(that, ref, args),
                    compute.always(ref));
            });
    });
};

/* Function
 ******************************************************************************/
/**
 * 
 */
var Function = function() {
    object.Object.call(this, null, {
        'prototype': {
            'value': functionPrototypeRef,
            'writable': false,
            'configurable': false,
            'enumerable': false
        },
        'length': {
            'value': new number.Number(1),
            'writable': false,
            'configurable': false,
            'enumerable': false
        }
    });
};

Function.prototype = new object.Object;
Function.prototype.constructor = Function;

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
    
    var obj = new object.Object();
    obj.proto = proto;
    var that = this;
    return compute.bind(
        value_reference_semantics.create(obj),
        function(ref) {
            return compute.next(
                that.call(ref, args),
                compute.always(ref));
        });
};

var initialize = function() {
    var builtin_function = require('atum/builtin/builtin_function')
    return compute.sequence(
        functionPrototypeRef.setValue(new FunctionPrototype()),
        functionPrototypeCallRef.setValue(new builtin_function.BuiltinFunction('toString', functionPrototypeCall)));
};

/* Export
 ******************************************************************************/
return {
    'Function': Function,
    'FunctionPrototype': FunctionPrototype,
    'initialize': initialize
};

});