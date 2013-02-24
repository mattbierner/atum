define(['atum/compute',
        'atum/type_conversion'],
function(compute,
        type_conversion) {
//"use strict";

/* Errors
 ******************************************************************************/
var ReferenceError = function(message) {
    this.message = message;
};

/* 
 ******************************************************************************/
var Reference = function(name, base, strictReference) {
    this.name = name;
    this.base = base;
    this.strictReference = strictReference;
};

var getBase = function(v) {
    return v.base;
};

var getReferencedName = function(v) {
    return v.name;
};

var isStrictReference = function(v) {
    return v.strictReference;
};

var hasPrimitiveBase = function(v) {
    switch (type(getBase(v)))
    {
    case 'boolean':
    case 'string':
    case 'number':
        return true;
    default:
        return false;
    }
};

var isPropertyReference = function(v) {
    return type(v) === 'object' || hasPrimitiveBase(v);
};


var isUnresolvableReference = function(v) {
    return getBase(v) === undefined;
};

/* Computations
 ******************************************************************************/
/**
 * Create a computation that dereferences the result of computation 'p'.
 */
var getValue = function(p) {
    return compute.bind(p, function(x) {
        if (!(x instanceof Reference)) {
            return compute.always(x);
        }
        if (isUnresolvableReference(x)) {
            return compute.never(new ReferenceError(getReferencedName(x)));
        }
        
        var base = getBase(x),
            name = getReferencedName(v);
        if (isPropertyReference(x)) {
            if (hasPrimitiveBase(x)) {
                return compute.bind(type_conversion.toObject(base), function(o) {
                    return compute.always(o[p]);
                });
            } else {
                return compute.always(base[name]);
            }
        } else { // Must be an environment record.
            return base.getBindingValue(name, isStrictReference(v));
        }
    });
};

var putValue = function(v, w) {
    return function(env, ok, err) {
        if (!v instanceof Reference) {
            return err(new ReferenceError());
        }
        
        var base = getBase(v);
        if (isUnresolvableReference(v)) {
            if (isStrictReference(v)) {
                return err(new ReferenceError());
            }
            
        }
    };
};

return {
    'Reference': Reference,
    
    'isUnresolvableReference': isUnresolvableReference,
    
    'getValue': getValue,
    
};

});