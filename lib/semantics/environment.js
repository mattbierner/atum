define(['atum/compute',
        'atum/context/environment',
        
        'atum/context/environment_record',
        'atum/reference',
        'atum/semantics/reference'],
function(compute,
        environment,
        environment_record,
        reference,
        reference_semantics) {
//"use strict";

/* Environment Reference
 ******************************************************************************/
/**
 * 
 */
var EnvironmentReference = function(name, base, strict) {
    this.name = name;
    this.base = base;
    this.strict = strict;
    
    this.isUnresolvable = (base === undefined);
};
EnvironmentReference.prototype = new reference.Reference;

EnvironmentReference.prototype.dereference = function(ctx) {
    var name = this.name,
        strict = this.strict;
    return compute.bind(
        this.base.dereference(),
        function(env) {
            return compute.always(environment_record.getBindingValue(env.record, name, strict));
        });
};

EnvironmentReference.prototype.set = function(value) {
    if (!this.base) {
        return (this.isStrict ?
            compute.never(new reference.ReferenceError("E")) :
            compute.next(setMutableBinding(this.name, this.isStrict, value), value));
    }
    return setMutableBinding(this.name, this.isStrict, value);
};

EnvironmentReference.prototype.getBase = function() {
    return this.base.dereference();
};


/*
 ******************************************************************************/
/**
 * 
 */
var getIdentifierReference = function(name) {
    return compute.bind(
        compute.context,
        function(ctx) {
            return compute.bind(
                environment.getIdentifierReference(ctx, ctx.lexicalEnvironment, name, ctx.strict),
                function(resolved) {
                    return compute.always(
                        new EnvironmentReference(name, (resolved ? resolved : undefined)));
                });
        });
};

/**
 * Computation that sets the value of an existing binding.
 * 
 * @param {string} name Identifier being bound.
 * @param {boolean} strict Is the binding strict.
 * @param value Computation that returns value being bound.
 */
var setMutableBinding = function(name, strict, value) {
    return compute.binda(
        compute.sequence(
            value,
            compute.context),
        function(v, ctx) {
            return compute.next(
                environment.setIdentifierReference(ctx, ctx.lexicalEnvironment, name, v, strict),
                compute.always(v));
        });
};


/* Export
 ******************************************************************************/
return {
    'getIdentifierReference': getIdentifierReference,
    'setMutableBinding': setMutableBinding,
    'putMutableBinding': setMutableBinding
};

});