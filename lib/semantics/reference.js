/**
 * @fileOverview Semantics for dealing with language level references.
 */
define(['atum/compute',
        'atum/reference',
        'atum/context/environment',
        'atum/value/type_conversion',
        'atum/semantics/environment', 'atum/semantics/object',
        'atum/semantics/iref'],
function(compute,
        reference,
        environment,
        type_conversion,
        environment_semantics, object_semantics,
        iref){

/* Computations
 ******************************************************************************/
/**
 * Create a computation that dereferences the result of computation 'v'.
 */
var getValue = function(v) {
    return compute.bind(v, function(x) {
        if (!(x instanceof reference.Reference)) {
            return compute.always(x);
        }
        if (x.isUnresolvable) {
            return compute.never(new reference.ReferenceError(x.name));
        }
        var base = x.base,
            name = x.name;
        if (x.isProperty) {
            return object_semantics.get(
                (x.hasPrimitiveBase ?
                    type_conversion.toObject(compute.always(base)) :
                    compute.always(base)),
                name);
        } else { // Must be an environment record.
            var ir = environment.EnvironmentRecord.getBindingValue(base.record, name, x.isStrict);
            return getValue(iref.getValue(ir));
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
                compute.next(environment_semantics.setMutableBinding(v.name, v.isStrict, w), w));
        } else if (v.isProperty) {
            return (v.hasPrimitiveBase ? 
                true :
                iref.create(w));
        }
        
        return compute.bind(
            environment_semantics.getIdentifierReference(v.name, v.strict),
            function(ref) {
                return compute.bind(
                    (ref.isUnresolable ? 
                        environment_semantics.putMutableBinding :
                        environment_semantics.setMutableBinding)(v.name, v.isStrict, w),
                    function(ir) {
                        return iref.getValue(ir);
                    });
        });
    });
};


return {
    'getValue': getValue,
    'putValue': putValue
};

});