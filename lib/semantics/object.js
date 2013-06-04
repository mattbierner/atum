/**
 * 
 */
define(['atum/compute',
        'atum/internal_reference',
        'atum/value/value',
        'atum/value/object',
        'atum/semantics/undef',
        'atum/semantics/value_reference',
        'atum/semantics/internal_reference'],
function(compute,
        internal_reference,
        value,
        object,
        undef,
        value_reference,
        internal_reference_semantics) {

/* Value Reference
 ******************************************************************************/
/**
 * Language level reference object.
 */
var PropertyReference = function(name, base, strict) {
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
PropertyReference.prototype = new internal_reference.InternalReference;

PropertyReference.prototype.getValue = function() {
    return (this.isUnresolvable ?
        compute.never(this.name) :
        get(this.base.getValue(), this.name));
};

PropertyReference.prototype.setValue = function(value) {
    return compute.next(
        defineProperty(
            internal_reference_semantics.getValue(compute.always(this.base)),
            this.name, {
                'value': value,
                'enumerable': true,
                'configurable': true
            }),
        compute.always(this));
};

PropertyReference.prototype.getBase = function(value) {
    return (this.isUnresolvable ?
        compute.never(new ReferenceError(this.name)) :
        this.base.getValue());
};


/* 
 ******************************************************************************/
/**
 * 
 */
var create = function(proto, properties) {
    return value_reference.create(
        compute.always(object.create(proto, properties)));
};

/**
 * 
 */
var get = function(obj, name) {
    return compute.binds(
        compute.sequence(
            obj,
            value_reference.getValue(obj)),
        function(ref, o) {
            return compute.bind(
                o.getProperty(name),
                function(prop) {
                    if (!prop) {
                        return undef.create();
                    }
                    return (prop.get ?
                        prop.get.call(ref, []) :
                        compute.always(prop.value));
                });
        });
};

/**
 * 
 */
var defineProperty = function(obj, name, desc) {
    return compute.binds(
        compute.sequence(
            obj,
            value_reference.getValue(obj)),
        function(ref, o) {
            return compute.binds(
                compute.sequence(
                    desc.value || compute.empty,
                    desc.get || compute.empty,
                    desc.set || compute.empty),
                function(value, get, set) {
                    var obj = object.defineProperty(o, name, {
                        'enumerable': !!desc.enumerable,
                        'configurable': !!desc.configurable,
                        'writable': !!desc.writable,
                        'value': value,
                        'get': get,
                        'set': set
                    });
                    return ref.setValue(obj);
                });
        });
};


return {
    'PropertyReference': PropertyReference,
    'create': create,
    'get': get,
    'defineProperty': defineProperty
};

});