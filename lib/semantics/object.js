/**
 * 
 */
define(['atum/compute',
        'atum/value/value', 'atum/value/object',
        'atum/semantics/undef',
        'atum/reference',
        'atum/semantics/iref', 'atum/semantics/reference'],
function(compute,
        value, object,
        undef,
        reference,
        iref, reference_semantics) {
/* Errors
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
ValueRef.prototype = new reference.Reference;

ValueRef.prototype.dereference = function() {
    if (this.isUnresolvable) {
        return compute.never(new ReferenceError(this.name));
    }
    return get(reference.dereference(this.base), this.name);
};

ValueRef.prototype.set = function(value) {
    return this.base.set(
        defineProperty(
            reference.dereference(this.base),
            this.name,
            {
                'value': value,
                'enumerable': true
            }));
};

ValueRef.prototype.getBase = function(value) {
    if (this.isUnresolvable) {
        return compute.never(new ReferenceError(this.name));
    }
    return reference.dereference(this.base);
};


/* 
 ******************************************************************************/
/**
 * 
 */
var create = function(proto, properties) {
    return compute.bind(
        iref.create(),
        function(ir) {
            return compute.next(ir.set(object.create(proto, properties)), compute.always(ir));
        });
};

/**
 * 
 */
var get = function(obj, name) {
    return compute.bind(obj, function(o) {
        var prop = o.getProperty(name);
        if (!prop) {
            return undef.create();
        }
        return (prop.get ?
            prop.get.call(o, []) :
            compute.always(prop.value));
    });
};

var defineProperty = function(obj, name, desc) {
    return compute.bind(
        reference_semantics.getValue(obj),
        function(o) {
            return compute.binda(
                compute.sequence(
                    desc.value || compute.always(null),
                    desc.get || compute.always(null),
                    desc.set || compute.always(null)),
                function(value, get, set) {
                    return compute.always(object.defineProperty(o, name, {
                        'enumerable': !!desc.enumerable,
                        'configurable': !!desc.configurable,
                        'writable': !!desc.writable,
                        'value': value,
                        'get': get,
                        'set': set
                    }));
                });
        });
};


return {
    'ValueReference': ValueRef,
    'create': create,
    'get': get,
    'defineProperty': defineProperty
};

});