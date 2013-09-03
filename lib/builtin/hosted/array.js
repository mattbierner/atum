"use strict";

/**
 * `Array.prototype.push(...)`
 */
Object.defineProperty(Array.prototype, 'push', {
    'value': function(/*...*/) {
        var o = Object(this);
        
        var len = o.length >>> 0,
            n = len;
        for (var i = 0; i < arguments.length; ++i)
            o[n++] = arguments[i];
        
        o.length = n;
        return n;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.pop()
 */
Object.defineProperty(Array.prototype, 'pop', {
    'value': function() {
        var o = Object(this);
        
        var len = o.length >>> 0;
        if (len === 0) {
            o.length = 0;
            return undefined;
        } else {
            var indx = len - 1;
            var element = o[indx];
            delete o[indx];
            o.length = indx;
            return element;
        }
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});


/**
 * Array.prototype.concat
 */
Object.defineProperty(Array.prototype, 'concat', {
    'value': function(/*...*/) {
        var o = Object(this);
        var a = new Array();
        var n = 0;
        var items = [o];
        for (var i = 0; i < arguments.length; ++i)
            items.push(arguments[i]);
        
        return a;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.map
 * 
 * Based on MDN suggestion.
 */
Object.defineProperty(Array.prototype, 'map', {
    'value': function(f, t) {
        if (this === null || this === undefined)
            throw new TypeError("this is null or not defined");
        
        var obj = Object(this);
        var len = obj.length >>> 0;
        
        if (typeof f !== "function")
            throw new TypeError(f + " is not a function");
        
        var arr = new Array(len);
        
        for (var i = 0; i < len; ++i) {
          if (i in obj) {
              var value = obj[i];
              var mappedValue = f.call(t, value, i, obj);
              Object.defineProperty(arr, i, {
                  'value': mappedValue,
                  'enumerable': false,
                  'configurable': true,
                  'writable': true
              });
          }
        }
        return arr;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

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
            isValueSet = (arguments.length > 1);
        
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
    'enumerable': false,
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
            isValueSet = (arguments.length > 1);
        
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
    'enumerable': false,
    'configurable': true,
    'writable': true
});