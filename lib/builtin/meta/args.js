/**
 * @fileOverview Arguments meta object
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/operations/number',
        'atum/operations/object'],
function(exports,
        amulet_object,
        compute,
        meta_object,
        number,
        object){
//"use strict";

var isArgumentsIndex = function(name) {
    return !isNaN(name) && +name >= 0;
};

/* Error
 ******************************************************************************/
var Arguments = function(proto, props, args) {
    meta_object.Object.call(this, proto, props);
    this.args = args;
};
Arguments.prototype = new meta_object.Object;
Arguments.prototype.constructor = Arguments;

Arguments.prototype.cls = "Arguments";

Arguments.prototype.defineOwnProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true
    });
    return ref.setValue(new Arguments(
        this.proto,
        properties));
};

Arguments.prototype.defineProperty = function(ref, name, desc) {
    var self = this;
    var oldLenDesc = this.getOwnProperty('length');
    var oldLen = (oldLenDesc ? oldLenDesc.value.value : 0);

    if (name === 'length' && oldLenDesc && oldLenDesc.value) {
        var newLenDesc = {
            'value': oldLenDesc.value,
            'get': oldLenDesc.get,
            'set': oldLenDesc.set,
            'enumerable': oldLenDesc.enumerable,
            'configurable': oldLenDesc.configurable,
            'writable': oldLenDesc.writable
        };
        // TODO
    } else if (isArgumentsIndex(name)) {
        var index = +name;
        if (index >= oldLen && oldLenDesc && !oldLenDesc.writable)
            return compute.error('TODO');
        
        if (index >= oldLen) {
            return object.defineProperty(
                self.defineOwnProperty(ref, name, desc),
                'length', {
                    'value': number.create(index + 1),
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
exports.Arguments = Arguments;

});