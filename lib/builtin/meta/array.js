/**
 * @fileOverview Array meta
 */
define(['exports',
        'bes/record',
        'atum/compute',
        'atum/fun',
        'atum/builtin/meta/object',
        'atum/operations/number',
        'atum/operations/object',
        'atum/value/compare',
        'atum/value/number',
        'atum/value/type_conversion'],
function(exports,
        record,
        compute,
        fun,
        meta_object,
        number,
        object,
        compare,
        number_value,
        type_conversion){
"use strict";

var isArrayIndex = function(name) {
    return !isNaN(name) && +name >= 0;
};

/* Array
 ******************************************************************************/
/**
 * Array meta
 */
var Array = record.extend(meta_object.Object, []);

Array.prototype.cls = "Array";

Array.prototype.defineOwnProperty = function() {
    return meta_object.Object.prototype.defineProperty.apply(this, arguments);
};

Array.prototype.defineProperty = function(ref, name, desc, strict) {
    var self = this;
    var oldLenDesc = this.getOwnProperty('length');
    var oldLen = oldLenDesc.value.value;
    
    if (name === 'length')
    {
        var len = type_conversion.toUint32(desc.value);
        if (!compare.strictEqual(len, type_conversion.toNumber(desc.value)))
            return error.rangeError();
        
        var newLenDesc = oldLenDesc.setValue(len);
        
        if (len.value >= oldLen)
            return self.defineOwnProperty(ref, 'length', newLenDesc);
        
        if (!oldLenDesc.writable)
            return error.rangeError();
        
        return compute.next(
            self.defineOwnProperty(ref, 'length', newLenDesc),
            compute.sequencea(
                fun.map(
                    fun.curry(object.deleteProperty, ref),
                    fun.range(oldLen - 1, len.value - 1, -1))));
    }
    else if (isArrayIndex(name))
    {
        var index = +name;
        if (index >= oldLen && !oldLenDesc.writable)
            return compute.error('TODO');
        
        if (index >= oldLen) {
            return compute.next(
                self.defineOwnProperty(ref, name, desc),
                object.defineProperty(ref, 'length',
                    oldLenDesc.setValue(number_value.Number.create(index + 1))));
        }
    }
    
    return self.defineOwnProperty(ref, name, desc);
};

/* Export
 ******************************************************************************/
exports.Array = Array;

});