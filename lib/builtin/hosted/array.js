/**
 * @fileOverview Array builtins defined in the hosted language.
 */
"use strict";

/**
 * Array.prototype.forEach
 * 
 */
Object.defineProperty(Array.prototype, 'forEach', {
    'value': function(f, thisArg) {
        if (this === null || this === undefined)
            throw new TypeError("this is null or not defined");
        
        var obj = Object(this);
        var len = obj.length >>> 0;
        
        if (typeof f !== "function")
            throw new TypeError(f + " is not a function");
        
        var t = (arguments.length > 1 ? thisArg : undefined);
        for (var i = 0; i < len; ++i)
            if (i in obj)
                f.call(t, obj[i], i, obj);
        return undefined;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.map
 */
Object.defineProperty(Array.prototype, 'map', {
    'value': function(f, thisArg) {
        if (this === null || this === undefined)
            throw new TypeError("this is null or not defined");
        
        var o = Object(this);
        var len = o.length >>> 0;
        
        if (typeof f !== "function")
            throw new TypeError(f + " is not a function");
        
        var t = (arguments.length > 1 ? thisArg : undefined);
        
        var arr = new Array(len);
        for (var i = 0; i < len; ++i) {
            if (i in o) {
                Object.defineProperty(arr, i, {
                    'value': f.call(t, o[i], i, o),
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
 */
Object.defineProperty(Array.prototype, 'reduce', {
    'value': function(f, z) {
        if (this === null || this === undefined)
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        
        var o = Object(this);

        if (typeof f !== 'function')
            throw new TypeError(f + ' is not a function');
        
        var length = o.length >>> 0,
            isValueSet = (arguments.length > 1);
        
        var i = 0;
        if (!isValueSet) {
            for (; i < length; ++i) {
                if (i in o) {
                    z = o[i];
                    isValueSet = true;
                    ++i;
                    break;
                }
            }
            if (!isValueSet)
                throw new TypeError('Reduce of empty array with no initial value');
        }
        
        for (; i < length; ++i)
            if (i in o)
                z = f(z, o[i], i, o);
        
        return z;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.reduceRight
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
                if (i in o) {
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
            if (i in o)
                z = f(z, this[i], i, this);
        
        return z;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

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
 * Array.prototype.shift()
 */
Object.defineProperty(Array.prototype, 'shift', {
    'value': function() {
        var o = Object(this);
        
        var len = o.length >>> 0;
        if (len === 0) {
            o.length = 0;
            return undefined;
        }
        var first = o[0];
        for (var i = 1; i < len; ++i) {
            var from = i,
                to = i - 1;
            if (from in o)
                o[to] = o[from];
            else
                delete o[to];
        }
        delete o[len - 1];
        o.length = len - 1;
        return first;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.unshift()
 */
Object.defineProperty(Array.prototype, 'unshift', {
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
        var items = [o];
        for (var i = 0; i < arguments.length; ++i)
            items.push(arguments[i]);
        
        for (var n = 0; items.length; ) {
            var e = items.shift();
            if (Array.isArray(e)) {
                for (var i = 0, len = e.length; i < len; ++i) {
                    if (i in e) {
                        Object.defineProperty(a, n, {
                            'value': e[i],
                            'writable': true,
                            'configurable': true,
                            'enumerable': true
                        });
                    }
                    ++n;
                }
            } else {
                Object.defineProperty(a, n, {
                    'value': e,
                    'writable': true,
                    'configurable': true,
                    'enumerable': true
                });
                ++n;
            }
        }
        
        return a;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.join
 */
Object.defineProperty(Array.prototype, 'join', {
    'value': function(seperator) {
        var o = Object(this);
        var len = o.length >>> 0;
        var sep = (seperator === undefined ? "," : seperator + "");
        
        if (len === 0)
            return "";
        
        var e0 = o[0];
        var r = (e0 === undefined || e0 === null ? "" : e0 + "");
        for (var i = 1; i < len; ++i) {
            var s = r + sep;
            var element = o[i];
            var next = (element === undefined || element === null ? "" : element + "");
            r = s + next;
        }
        return r;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.toString
 */
Object.defineProperty(Array.prototype, 'toString', {
    'value': function() {
        var o = Object(this);
        var func = o.join;
        if (typeof func !== "function")
            func = Object.prototype.toString;
        return func.call(o);
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.every
 */
Object.defineProperty(Array.prototype, 'every', {
    'value': function(f, thisArg) {
        if (this === null || this === undefined)
            throw new TypeError("this is null or not defined");
        
        var o = Object(this);
        var len = o.length >>> 0;
        
        if (typeof f !== "function")
            throw new TypeError(f + " is not a function");
        
        var t = (arguments.length > 1 ? thisArg : undefined);
        
        for (var i = 0; i < len; ++i) {
            if (i in o)
                if (!f.call(t, o[i], i, o))
                    return false;
        }
        return true;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.some
 */
Object.defineProperty(Array.prototype, 'some', {
    'value': function(f, thisArg) {
        if (this === null || this === undefined)
            throw new TypeError("this is null or not defined");
        
        var o = Object(this);
        var len = o.length >>> 0;
        
        if (typeof f !== "function")
            throw new TypeError(f + " is not a function");
        
        var t = (arguments.length > 1 ? thisArg : undefined);
        
        for (var i = 0; i < len; ++i) {
            if (i in o)
                if (f.call(t, o[i], i, o))
                    return true;
        }
        return false;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.indexOf
 */
Object.defineProperty(Array.prototype, 'indexOf', {
    'value': function(searchElement, fromIndex) {
        var o = Object(this);
        var len = o.length >>> 0;
        
        if (len === 0)
            return -1;
        var n  = (fromIndex === undefined ? 0 : +Number.prototype.toFixed.call(Number(fromIndex)));
        if (n >= len)
            return -1;
        
        var k;
        if (n < 0) {
            k = len - Math.abs(n);
            if (k < 0)
                k = 0;
        } else {
            k = 0;
        }
        
        for (; k < len ; ++k) {
            if (k in o)
                if (o[k] === searchElement)
                    return k;
        }
        return -1;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.lastIndexOf
 */
Object.defineProperty(Array.prototype, 'lastIndexOf', {
    'value': function(searchElement, fromIndex) {
        var o = Object(this);
        var len = o.length >>> 0;
        
        if (len === 0)
            return -1;
        var n  = (fromIndex === undefined ? len - 1 : +Number.prototype.toFixed.call(Number(fromIndex)));
        if (n >= len)
            return -1;
        
        var k;
        if (n >= 0) {
            k = Math.min(n , len - 1);
        } else {
            k = len - Math.abs(n);
        }
        
        for (; k >= 0; --k) {
            if (k in o)
                if (o[k] === searchElement)
                    return k;
        }
        return -1;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.slice
 */
Object.defineProperty(Array.prototype, 'slice', {
    'value': function(start, end) {
        var o = Object(this);
        var len = o.length >>> 0;
        var a = new Array();
        
        var relativeStart = Math.round(start);
        var relativeEnd = (end === undefined ? len : Math.round(end));
        
        var k = (relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len));
        var fin = (relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len));

        var n = 0;
        while (k < fin) {
            if (k in o) {
                Object.defineProperty(a, n, {
                    'value': o[k],
                    'enumerable': true,
                    'writable': true,
                    'configurable': true
                });
            }
            ++k;
            ++n;
        }
        return a;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * Array.prototype.splice
 */
Object.defineProperty(Array.prototype, 'splice', {
    'value': function(start, deleteCount /*, items... */) {
        var o = Object(this);
        var len = o.length >>> 0;
        var a = new Array();
        
        var relativeStart = Math.round(start);
        var actualStart = (relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len));
        var actualDeleteCount = Math.min(Math.max(Math.round(deleteCount), 0), len - actualStart);
        
        for (var i = 0; i < actualDeleteCount; ++i) {
            if (i in o) {
                Object.defineProperty(a, i, {
                    'value': o[i],
                    'enumerable': true,
                    'writable': true,
                    'configurable': true
                });
            }
        }
        
        var items = Array.prototype.slice.call(arguments, 2);
        var itemCount = items.length;
        if (itemCount < actualDeleteCount) {
            for (var k = actualStart; k < len - actualDeleteCount; ++k) {
                var from = k + actualDeleteCount;
                var to = k + itemCount;
                if (from in o) {
                    o[to] = o[from];
                } else {
                    delete o[to];
                }
            }
            for (var k = len; k > len - actualDeleteCount + itemCount; --k)
                delete o[k -1];
        } else if (items.length > actualDeleteCount) {
             for (var k = len - actualDeleteCount; k > actualStart; --k) {
                var from = k + actualDeleteCount - 1;
                var to = k + itemCount - 1;
                if (from in o) {
                    o[to] = o[from];
                } else {
                    delete o[to];
                }
            }
        }
        
        var k = actualStart;
        for (var i = 0; i < items.length; ++i)
            o[k] = items[i];
        
        o.length = len - actualDeleteCount + itemCount;
        return a;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});