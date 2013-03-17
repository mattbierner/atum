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
 * Create a computation that dereferences the result of computation 'v'.
 */
var getValue = function(v) {
    return compute.binda(
        compute.sequence(
            v,
            compute.context),
        function(x, ctx) {
            if (!(x instanceof reference.Reference)) {
                return compute.always(x);
            }
            return x.dereference(ctx);
        });
};

/**
 * 
 */
var putValue = function(value, w) {
    return compute.bind(value, function(x) {
        if (!x instanceof reference.Reference) {
            return compute.never(new reference.ReferenceError());
        }
        return x.set(w);

        
        var base = v.base;
        if (v.isUnresolvable) {
            return (v.isStrict ?
                compute.never(new reference.ReferenceError("E")) :
                compute.next(environment_semantics.setMutableBinding(v.name, v.isStrict, w), w));
        } else if (v.isProperty) {
            return compute.bind(
                object_semantics.defineProperty(compute.always(v.base), v.name, {'value': w, 'enumerable': true}),
                function(obj) {
                    return iref.update(v, compute.always(obj));
                });
                
            return (v.hasPrimitiveBase ? 
                true :
                iref.update(value, w));
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