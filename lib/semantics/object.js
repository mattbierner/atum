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
    
/* 
 ******************************************************************************/
var ValueReference = (function(){
    var counter = 100000;

    return function() {
        this.key = counter++;
        this.isUnresolvable = false;
    };
}());

ValueReference.prototype.dereference = function() {
    var key = this.key;
    return compute.bind(
        compute.context,
        function(ctx) {
            return compute.always(ctx.values[key]);
        });
};

ValueReference.prototype.set = function(value) {
    var key = this.key;
    return compute.bind(value, function(v) {
        return function(ctx, ok, err) {
            return ok(value, ctx.setValue(key, v));
        };
    });
};

var irefcreate = function() {
    return compute.always(new ValueReference());
};

/**
 */
var irefset = function(ir, value) {
    return compute.binda(
        compute.sequence(ir, value),
        function(i, v) {
            return i.set(v);
        });
};


var irefget = function(v) {
    return compute.Computation('Get Value',
        compute.bind(
            v,
            function(x) {
                return x.dereference();
            }));
};


    
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
PropertyReference.prototype = new reference.Reference;

PropertyReference.prototype.dereference = function() {
    if (this.isUnresolvable) {
        return compute.never(new ReferenceError(this.name));
    }
    return get(reference.dereference(this.base), this.name);
};

PropertyReference.prototype.set = function(value) {
    var base = this.base;
    var that = this;
    return compute.bind(
        defineProperty(
            reference_semantics.getValue(compute.always(base)),
            this.name,
            {
                'value': value,
                'enumerable': true
            }),
        function(o) {
            return compute.always(that);
        });
};

PropertyReference.prototype.getBase = function(value) {
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
        irefcreate(),
        function(ir) {
            return compute.next(ir.set(compute.always(object.create(proto, properties))), compute.always(ir));
        });
};

/**
 * 
 */
var get = function(obj, name) {
    return compute.binda(
        compute.sequence(
            obj,
            irefget(obj)),
        function(ref, o) {
            var prop = o.getProperty(name);
            if (!prop) {
                return undef.create();
            }
            return (prop.get ?
                prop.get.call(ref, []) :
                compute.always(prop.value));
        });
};

var defineProperty = function(obj, name, desc) {
    return compute.binda(
        compute.sequence(
            obj,
            irefget(obj)),
        function(ref, o) {
            return compute.binda(
                compute.sequence(
                    desc.value || compute.always(null),
                    desc.get || compute.always(null),
                    desc.set || compute.always(null)),
                function(value, get, set) {
                    var obj = object.defineProperty(o, name, {
                        'enumerable': !!desc.enumerable,
                        'configurable': !!desc.configurable,
                        'writable': !!desc.writable,
                        'value': value,
                        'get': get,
                        'set': set
                    });
                    return compute.next(ref.set(compute.always(obj)), compute.always(ref));
                });
        });
};


return {
    'ValueReference': ValueReference,
    'PropertyReference': PropertyReference,
    'create': create,
    'get': get,
    'defineProperty': defineProperty
};

});