/**
 * @fileOverview String builtins defined in the hosted language.
 */
"use strict";

/**
 * String.prototype.charAt
 */
Object.defineProperty(String.prototype, 'charAt', {
    'value': function(position) {
        var o = String(this);
        var len = o.length >>> 0;
        var pos = (position === undefined ? 0 : +Number.prototype.toFixed.call(position));
        
        if (pos < 0 || pos >= len)
            return "";
        return o[pos];
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * String.prototype.indexOf
 */
Object.defineProperty(String.prototype, 'indexOf', {
    'value': function(searchString, position) {
        var o = String(this);
        var len = o.length >>> 0;
        
        var searchStr = String(searchString);
        var pos = (position === undefined ? 0 : +Number.prototype.toFixed.call(position));
        
        for (var i = pos; i < len; ++i) {
            var found = 0;
            for (; found < searchStr.length; ++found) {
                var idx = i + found;
                if (idx >= len || o[idx] !== searchString[found])
                    break;
            }
            if (found === searchStr.length)
                return i;
        }
        return -1;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * String.prototype.lastIndexOf
 */
Object.defineProperty(String.prototype, 'lastIndexOf', {
    'value': function(searchString, position) {
        var o = String(this);
        var len = o.length >>> 0;
        
        var searchStr = String(searchString);
        var pos = (position === undefined ? len - 1 : +Number.prototype.toFixed.call(position));
        
        for (var i = pos; i >= 0; --i) {
            var found = 0;
            for (; found < searchStr.length; ++found) {
                var idx = i + found;
                if (idx >= len || o[idx] !== searchString[found])
                    break;
            }
            if (found === searchStr.length)
                return i;
        }
        return -1;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * String.prototype.slice
 */
Object.defineProperty(String.prototype, 'slice', {
    'value': function(start, end) {
        return Array.prototype.slice.call(String(this), start, end).join('');
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * String.prototype.substring
 */
Object.defineProperty(String.prototype, 'substring', {
    'value': function(start, end) {
        var o = String(this);
        var len = o.length;
        
        var intStart = +Number.prototype.toFixed.call(start);
        var intEnd = (end === undefined ? len : +Number.prototype.toFixed.call(end));

        var finalStart = Math.min(Math.max(intStart, 0), len);
        var finalEnd = Math.min(Math.max(intEnd, 0), len);
        
        var from = Math.min(finalStart, finalEnd);
        var to = Math.max(finalStart, finalEnd);
        
        var s = "";
        for (var i = from; i < to; ++i)
            s += o[i];
        return s;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * String.prototype.trim
 */
(function(){
    
var isWhitespace = function(x) {
    switch (x) {
    case ' ':
    case '\n':
        return true;
    default:
        return false;
    }
};

Object.defineProperty(String.prototype, 'trim', {
    'value': function() {
        var o = String(this);
        var start = 0,
            end = o.length >>> 0;
        
        for (; start < end; ++start) {
            if (!isWhitespace(o[start]))
                break;
        }
        for (; end > start; --end) {
            if (!isWhitespace(o[end - 1]))
                break;
        }
        return o.slice(start, end);
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});
}());

/**
 * String.prototype.concat
 */
Object.defineProperty(String.prototype, 'concat', {
    'value': function(string1 /*, ...*/) {
        var o = String(this);
        var r = o;
        
        for (var i = 0; i < arguments.length; ++i)
            r += arguments[i];
        return r;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

