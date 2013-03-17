/**
 * @fileOverview Language level reference type.
 */
define(['atum/compute',
        'atum/value/value'],
function(compute,
        value) {
//"use strict";

/* Errors
 ******************************************************************************/
var ReferenceError = function(message) {
    this.message = message;
};

ReferenceError.prototype.toString = function() {
    return "ReferenceError: " + this.message;
};

/* Reference
 ******************************************************************************/
var Reference = function() { };

/* Value Reference
 ******************************************************************************/
/**
 * Language level reference object.
 */
var ValueRef = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
    
    this.isUnresolvable = (base === undefined);

    if (!this.isUnresolvable) {
        switch (value.type(base))
        {
        case 'boolean':
        case 'string':
        case 'number':
            this.hasPrimitiveBase = true;
            break;
        default:
            this.hasPrimitiveBase = false;
            break;
        }
        this.isProperty = (value.type(base) === 'object' || this.hasPrimitiveBase);
    } else {
        this.isProperty =  false;
        this.hasPrimitiveBase = false;
    }
};
ValueRef.prototype = new Reference;

ValueRef.prototype.dereference = function(ctx) {
     if (this.isUnresolvable) {
        return compute.never(new ReferenceError(this.name));
    }
    return compute.always(this.base[this.name]);
};

/* Iref
 ******************************************************************************/
var Iref = (function(){
    var counter = 0;

    return function() {
        this.key = counter++;
        this.isUnresolvable = false;
    };
}());
Iref.prototype = new Reference;

Iref.prototype.dereference = function() {
    var key = this.key;
    return compute.bind(
        compute.context,
        function(ctx) {
            return compute.always(ctx.values[key]);
        });
};

Iref.prototype.set = function(ctx, value) {
    var key = this.key;
    return function(ctx, ok, err) {
        return ok(value, ctx.setValue(key, value));
    };
};

/* Errors
 ******************************************************************************/
return {
    'ReferenceError': ReferenceError,
    'Reference': Reference,
    
    'ValueReference': ValueRef,
    'Iref': Iref,
};

});