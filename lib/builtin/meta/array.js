/**
 * @fileOverview Array meta
 */
define(['exports',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/operations/number',
        'atum/operations/object',
        'atum/value/type_conversion',
        'atum/value/number',
        'atum/value/property',
        'atum/value/value'],
function(exports,
        compute,
        meta_object,
        number,
        object,
        type_conversion,
        number_value,
        property,
        value){
"use strict";

var isArrayIndex = function(name) {
    return !isNaN(name) && +name >= 0;
};

/* Array
 ******************************************************************************/
/**
 * Array meta
 */
var Array = function(proto, props) {
    meta_object.Object.call(this, proto, props);
};
Array.prototype = new meta_object.Object;
Array.prototype.constructor = Array;

Array.prototype.cls = "Array";

Array.prototype.setProperties = function(properties) {
    return new Array(this.proto, properties);
};

Array.prototype.setPrototype = function(proto) {
    return new Array(proto, this.properties);
};

Array.prototype.defineOwnProperty = function() {
    return meta_object.Object.prototype.defineProperty.apply(this, arguments);
};

Array.prototype.defineProperty = function(ref, name, desc) {
    var self = this;
    var oldLenDesc = this.getOwnProperty('length');
    var oldLen = (oldLenDesc ? oldLenDesc.value.value : 0);
    
    if (name === 'length' && oldLenDesc && oldLenDesc.value) {
        if (!value.isNumber(desc.value))
            return error.rangeError();
        
        var len = type_conversion.toUint32(desc.value);
        if (len.value !== desc.value.value)
            return error.rangeError();
        
        var newLenDesc = {
            'value': len,
            'get': oldLenDesc.get,
            'set': oldLenDesc.set,
            'enumerable': oldLenDesc.enumerable,
            'configurable': oldLenDesc.configurable,
            'writable': oldLenDesc.writable
        };
        
        if (len.value >= oldLen)
            return self.defineOwnProperty(ref, 'length', newLenDesc);
        
        if (!oldLenDesc.writable)
            return error.rangeError();
        
        return compute.bind(
            self.defineOwnProperty(ref, 'length', newLenDesc),
            function(x) {
                var dels = [];
                for (var i = oldLen - 1; i >= len.value; --i)
                    dels.push(object.deleteProperty(ref, i));
                return compute.sequencea(dels);
            });
    } else if (isArrayIndex(name)) {
        var index = +name;
        if (index >= oldLen && oldLenDesc && !oldLenDesc.writable)
            return compute.error('TODO');
        
        if (index >= oldLen) {
            return object.defineProperty(
                self.defineOwnProperty(ref, name, desc),
                'length', property.createValueProperty(
                    new number_value.Number(index + 1),
                    (oldLenDesc ? oldLenDesc.enumerable : false),
                    (oldLenDesc ? oldLenDesc.writable : true),
                    (oldLenDesc ? oldLenDesc.configurable : true)));
        }
    }
    
    return self.defineOwnProperty(ref, name, desc);
};

/* Export
 ******************************************************************************/
exports.Array = Array;

});