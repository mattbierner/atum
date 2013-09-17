/**
 * @fileOverview Number builtins defined in the hosted language.
 */
"use strict";

/**
 * `Math.max(value1, value2, ...)`
 */
Object.defineProperty(Math, 'max', {
    'value': function(value1, value2 /*, ...*/) {
        var largest = -Infinity;
        for (var i = 0; i < arguments.length; ++i) {
            var val = Number(arguments[i]);
            if (isNaN(val))
                return NaN;
            if (val > largest)
                largest = val;
        }
        return largest;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * `Math.min(value1, value2, ...)`
 */
Object.defineProperty(Math, 'min', {
    'value': function(value1, value2 /*, ...*/) {
        var smallest = Infinity;
        for (var i = 0; i < arguments.length; ++i) {
            var val = Number(arguments[i]);
            if (isNaN(val))
                return NaN;
            if (val < smallest)
                smallest = val;
        }
        return smallest;
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});