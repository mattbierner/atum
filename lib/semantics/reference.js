/**
 * @fileOverview Semantics for dealing with references.
 */
define(['atum/compute',
        'atum/reference',
        'atum/value/type_conversion'],
function(compute,
        reference,
        type_conversion){

/* Computations
 ******************************************************************************/
/**
 * Create a computation that dereferences the result of computation 'p'.
 */
var getValue = function(p) {
    return compute.bind(p, function(x) {
        if (!(x instanceof reference.Reference)) {
            return compute.always(x);
        }
        if (x.isUnresolvable) {
            return compute.never(new reference.ReferenceError(getReferencedName(x)));
        }
        
        var base = x.base,
            name = x.name;
        if (x.isProperty) {
            return (x.hasPrimitiveBase ?
                compute.bind(type_conversion.toObject(base), function(o) {
                    return compute.always(o[p]);
                }) :
                compute.always(base[name]));
        } else { // Must be an environment record.
            return compute.always(base.getBindingValue(name, reference.isStrictReference(x)));
        }
    });
};

/**
 * 
 */
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
    'getValue': getValue,
    'putValue': putValue
};

});