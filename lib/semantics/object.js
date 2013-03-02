define(['atum/compute',
        'atum/value/object'],
function(compute,
        object) {

var create = function(proto, properties) {
    return compute.always(object.create(proto, properties));
};

var defineProperty = function(obj, name, desc) {
    return compute.bind(obj, function(o) {
        return compute.binda(
            compute.sequence(
                desc.value),
            //    desc.get,
              //  desc.set),
            function(value, get, set) {
                return compute.always(object.defineProperty(o, name, {
                    'enumerable': !!desc.enumerable,
                    'configurable': !!desc.configurable,
                    'writable': !!desc.writable,
                    'value': value,
                    //'get': get,
                //    'set': set
                }));
            });
    });
};


return {
    'create': create,
    'defineProperty': defineProperty
};

});