/**
 * @fileOverview Semantics for dealing with references.
 */
define(['atum/compute',
        'atum/reference',
        'atum/value/type_conversion',
        'atum/semantics/environment', 'atum/semantics/object'],
function(compute,
        reference,
        type_conversion,
        environment, object_semantics){

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
            return compute.never(new reference.ReferenceError(x.name));
        }
        
        var base = x.base,
            name = x.name;
        if (x.isProperty) {
            return (x.hasPrimitiveBase ?
                    object_semantics.get(type_conversion.toObject(compute.always(base)), name) :
                    object_semantics.get(compute.always(base), name));
        } else { // Must be an environment record.
            return compute.always(base.getBindingValue(name, x.isStrict));
        }
    });
};

/**
 * 
 */
var putValue = function(value, w) {
    return compute.bind(value, function(v) {
        if (!v instanceof reference.Reference) {
            return compute.never(new reference.ReferenceError());
        }
        
        var base = v.base;
        if (v.isUnresolvable) {
            return (v.isStrict ?
                compute.never(new reference.ReferenceError("E")) :
                environment.setMutableBinding(v.name, v.isStrict, w));
        } else if (v.isProperty) {
          //  if (v.hasPrimitiveBase )
        }
        
        return compute.bind(
            environment.getIdentifierReference(v.name, v.strict),
            function(ref) {
                return (ref.isUnresolable ? 
                    environment.putMutableBinding :
                    environment.setMutableBinding)(v.name, v.isStrict, w);
        });
    });
};


return {
    'getValue': getValue,
    'putValue': putValue
};

});