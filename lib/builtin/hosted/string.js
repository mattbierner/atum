/**
 * @fileOverview String builtins defined in the hosted language.
 */
"use strict";

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
