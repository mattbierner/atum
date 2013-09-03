"use strict";

/**
 * Array.prototype.reduce
 * 
 * Based on MDN suggestion.
 */
Object.defineProperty(Array.prototype, 'reduce', {
    'value': function(f, z) {
        if (this === null || this === undefined)
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        
        if (typeof f !== 'function')
            throw new TypeError(f + ' is not a function');
        
        var length = this.length >>> 0,
            isValueSet = (z !== undefined);//(arguments.length > 1);
        var i = 0;
        if (!isValueSet) {
            for (; i < length; ++i) {
                if (this.hasOwnProperty(i)) {
                    z = this[i];
                    isValueSet = true;
                    ++i;
                    break;
                }
            }
            if (!isValueSet)
                throw new TypeError('Reduce of empty array with no initial value');
        }
        
        for (; i < length; ++i)
            if (this.hasOwnProperty(i))
                z = f(z, this[i], i, this);
        
        return z;
    },
    'enumerable': true,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.reduceRight
 * 
 * Based on MDN suggestion.
 */
Object.defineProperty(Array.prototype, 'reduceRight', {
    'value': function(f, z) {
        if (this === null || this === undefined)
            throw new TypeError('Array.prototype.reduceRight called on null or undefined');
        
        if (typeof f !== 'function')
            throw new TypeError(f + ' is not a function');
        
        var length = this.length >>> 0,
            isValueSet = (z !== undefined);//(arguments.length > 1);
        
        var i = length - 1;
        if (!isValueSet) {
            for (; i >= 0; --i) {
                if (this.hasOwnProperty(i)) {
                    z = this[i];
                    isValueSet = true;
                    --i;
                    break;
                }
            }
            if (!isValueSet)
                throw new TypeError('ReduceRight of empty array with no initial value');
        }
        
        for (; i >= 0; --i)
            if (this.hasOwnProperty(i))
                z = f(z, this[i], i, this);
        
        return z;
    },
    'enumerable': true,
    'configurable': true,
    'writable': true
});
