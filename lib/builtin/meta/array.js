/**
 * @fileOverview
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/operations/object',
        'atum/value/number'],
function(exports,
        amulet_object,
        compute,
        meta_object,
        object,
        number){
//"use strict";

var isArrayIndex = function(name) {
    return !isNaN(name) && +name >= 0;
};
    
/* Error
 ******************************************************************************/
var Array = function(proto, props) {
    meta_object.Object.call(this, proto, props);
};
Array.prototype = new meta_object.Object;
Array.prototype.constructor = Array;

Array.prototype.cls = "Array";

Array.prototype.defineOwnProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true,
        'configurable': true,
        'writable': true
    });
    return ref.setValue(new Array(
        this.proto,
        properties));
};

Array.prototype.defineProperty = function(ref, name, desc) {
    var self = this;
    var oldLenDesc = this.getOwnProperty('length');
    var oldLen = (oldLenDesc ? oldLenDesc.value.value : 0);

    if (name === 'length') {
        // TODO
    } else if (isArrayIndex(name)) {
        var index = +name;
        if (index >= oldLen && oldLenDesc && !oldLenDesc.writable) {
            return compute.error('TODO');
        }
        if (index >= oldLen) {
            return object.defineProperty(
                self.defineOwnProperty(ref, name, desc),
                'length', {
                    'value': compute.just(new number.Number(index + 1)),
                    'enumerable': (oldLenDesc ? oldLenDesc.enumerable : false),
                    'writable': (oldLenDesc ? oldLenDesc.writable : true),
                    'configurable': (oldLenDesc ? oldLenDesc.configurable : true)
                });
        }
    }
    return self.defineOwnProperty(ref, name, desc);
};

/* Export
 ******************************************************************************/
exports.Array = Array;

});