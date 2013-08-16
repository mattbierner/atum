/**
 * @fileOverview Meta hosted function object.
 */
define(['exports',
        'atum/compute',
        'atum/value_reference',
        'atum/builtin/object',
        'atum/builtin/meta/object',
        'atum/operations/error',
        'atum/operations/object',
        'atum/operations/value_reference',
        'atum/value/object',
        'atum/value/value'],
function(exports,
        compute,
        value_reference,
        builtin_object,
        meta_object,
        error,
        object_operations,
        value_reference_semantics,
        object,
        value){
//"use strict";

/* Function
 ******************************************************************************/
/**
 * Meta object for a hosted function.
 */
var Function = function(proto, props) {
    object.Object.call(this, proto, props);
};
Function.prototype = new object.Object;

Function.prototype.cls = "Function";
Function.prototype.proto = null;

/**
 */
Function.prototype.construct = function(args) {
    var self = this;
    return compute.bind(this.get(null, 'prototype'), function(proto) {
        proto = (proto && proto instanceof value_reference.ValueReference ?
                proto :
                builtin_object.ObjectPrototype);
        
        return compute.bind(
            value_reference_semantics.create(new meta_object.Object(proto, {})),
            function(ref) {
                return compute.bind(self.call(self, ref, args), function(result) {
                    return compute.just(result instanceof value_reference.ValueReference ?
                        result :
                        ref);
                });
            });
    });
};


/**
 * Is computation `v` an instance of function `ref`.
 */
Function.prototype.hasInstance = (function(){
    var loop = function(v, o) {
        if (!v.proto)
            return compute.no;
        return compute.bind(
            value_reference_semantics.getValue(compute.just(v.proto)),
            function(v) {
                console.log(v, o);
                return (v === o ?
                    compute.yes :
                    loop(v, o));
            });
    };
    
    return function(ref, v) {
        var self = this;
        return compute.bind(value_reference_semantics.getValue(compute.just(v)), function(v) {
            if (!value.isObject(v))
                return compute.no;
            return compute.bind(
                value_reference_semantics.getValue(self.get(ref, 'prototype')),
                function(o) {
                    if (!value.isObject(o))
                        return error.typeError();
                    return loop(v, o)
                });
        });
    };
}());

/* Export
 ******************************************************************************/
exports.Function = Function;

});