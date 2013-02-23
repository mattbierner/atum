define(['atum/compute', 'atum/value'],
function(compute, value) {
//"use strict";

/**
 * 
 */
var toPrimitive = function(input, preferredType) {
    return compute.bind(input, function(x) {
        if (value.type(x) === "Object") {
            return compute.always(x.defaultValue(preferredType));
        }
        return compute.always(x);
    });
};

/**
 * 
 */
var toNumber = function(input) {
    return compute.bind(input, function(x) {
        switch (value.type(x)) {
        case 'Undefined':
            return compute.always(NaN);
        case 'Null':
            return compute.always(0);
        case 'Boolean':
            return compute.always(x ? 1 : 0);
        case 'Number':
            return compute.always(x);
        case 'String':
            return compute.always(x.toNumber());
        case 'Object':
            return toNumber(toPrimitive(x));
        }
    });
};




return {
    'toPrimitive': toPrimitive,
    'toNumber': toNumber
};

});