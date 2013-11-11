/**
 * @fileOverview Object builtins defined in the hosted language.
 */
"use strict";

var isDataDescriptor = function(desc) {
    if (!desc)
        return false;
    return desc.hasOwnProperty('value') || desc.hasOwnProperty('writable');
};

/**
 * `isFrozen(obj)`
 */
Object.defineProperty(Object, 'isFrozen', {
    'value': function isFrozen(obj) {
        var type = typeof obj;
        if (type !== 'object' && type !== 'function')
            throw new TypeError();
        
        var names = Object.getOwnPropertyNames(obj);
        for (var i = 0, len = names.length; i < len; ++i) {
            var name = names[i];
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc.writable)
                return false
        }
        
        return !Object.isExtensible(obj);
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * `Object.freeze(obj)`
 */
Object.defineProperty(Object, 'freeze', {
    'value': function freeze(obj) {
        var type = typeof obj;
        if (type !== 'object' && type !== 'function')
            throw new TypeError();
        
        var names = Object.getOwnPropertyNames(obj);
        for (var i = 0, len = names.length; i < len; ++i) {
            var name = names[i];
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (isDataDescriptor(desc)) {
                if (desc.writable) {
                    desc.writable = false;
                    Object.defineProperty(obj, name, desc);
                }
            }
        }
        Object.preventExtensions(obj);
        return obj;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * `Object.isSealed(obj)`
 */
Object.defineProperty(Object, 'isSealed', {
    'value': function isSealed(obj) {
        var type = typeof obj;
        if (type !== 'object' && type !== 'function')
            throw new TypeError();
        
        var names = Object.getOwnPropertyNames(obj);
        for (var i = 0, len = names.length; i < len; ++i) {
            var name = names[i];
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc.configurable)
                return false
        }
        
        return !Object.isExtensible(obj);
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * `Object.seal(obj)`
 */
Object.defineProperty(Object, 'seal', {
    'value': function seal(obj) {
        var type = typeof obj;
        if (type !== 'object' && type !== 'function')
            throw new TypeError();
        
        var names = Object.getOwnPropertyNames(obj);
        for (var i = 0, len = names.length; i < len; ++i) {
            var name = names[i];
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (isDataDescriptor(desc)) {
                if (desc.configurable) {
                    desc.configurable = false;
                    Object.defineProperty(obj, name, desc);
                }
            }
        }
        Object.preventExtensions(obj);
        return obj;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});