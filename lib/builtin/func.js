/**
 * 
 */
define(['atum/compute',
        'atum/value_reference',
        'atum/value/type',
        'atum/value/value',
        'atum/value/object',
        'atum/value/number',
        'atum/operations/value_reference',
        'exports'],
function(compute,
        value_reference,
        type,
        value,
        object,
        number,
        value_reference_semantics,
        exports){
//"use strict";

/* Refs
 ******************************************************************************/
var functionPrototypeRef = new value_reference.ValueReference();

var functionPrototypeCallRef = new value_reference.ValueReference();

/* FunctionPrototype
 ******************************************************************************/
var FunctionPrototype = function() {
    var builtin_object = require('atum/builtin/object');
    object.Object.call(this, builtin_object.objectPrototype, {
        'call': {
            'value': functionPrototypeCallRef
        },
        'prototype': {
            'value': builtin_object.objectPrototypeRef
        }
    });
};
FunctionPrototype.prototype = new object.Object;


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
    var builtin_object = require('atum/builtin/object');
    var that = this;
    return compute.bind(this.get(null, 'prototype'), function(proto) {
        proto = (proto && proto instanceof value_reference.ValueReference ? proto : builtin_object.objectPrototypeRef);
        
        var obj = new object.Object(proto);
        return compute.bind(
            value_reference_semantics.create(obj),
            function(ref) {
                return compute.bind(that.call(that, ref, args), function(result) {
                    return compute.always(result instanceof value_reference.ValueReference ?
                        result :
                        ref);
                });
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
        object.objectPrototypeRef);
    
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
return exports = {
    'Function': Function,
    'FunctionPrototype': FunctionPrototype,
    'initialize': initialize
};

});