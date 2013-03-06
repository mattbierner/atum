/**
 * @fileOverview Semantics for dealing with language level references.
 */
define(['atum/compute',
        'atum/reference',
        'atum/context/environment',
        'atum/value/type_conversion',
        'atum/semantics/environment', 'atum/semantics/object'],
function(compute,
        reference,
        environment,
        type_conversion,
        environment_semantics, object_semantics){

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
            return object_semantics.get((x.hasPrimitiveBase ?
                    type_conversion.toObject(compute.always(base)) :
                    compute.always(base)),
                name);
        } else { // Must be an environment record.
            var key = environment.EnvironmentRecord.getBindingValue(base, name, x.isStrict);
            return compute.bind(compute.context, function(ctx) {
                return compute.always(ctx.getValue(key));
            });
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
                environment_semantics.setMutableBinding(v.name, v.isStrict, w));
        } else if (v.isProperty) {
            return (v.hasPrimitiveBase ? 
                true :
                compute.bind(w, function(r) {
                    return function(ctx, ok, err) {
                        return ok(r, ctx.setValue(base.key, base.defineOwnProperty(v.name, {'value': r})));
                    };
                }));
        }
        
        return compute.bind(
            environment_semantics.getIdentifierReference(v.name, v.strict),
            function(ref) {
                return (ref.isUnresolable ? 
                    environment_semantics.putMutableBinding :
                    environment_semantics.setMutableBinding)(v.name, v.isStrict, w);
        });
    });
};


return {
    'getValue': getValue,
    'putValue': putValue
};

});