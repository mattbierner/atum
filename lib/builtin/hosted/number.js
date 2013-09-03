/**
 * @fileOverview Number builtins defined in the hosted language.
 */
"use strict";

/**
 *
 */
Object.defineProperties(Number, {
    'NaN': {
        'value': NaN,
        'enumerable': false,
        'configurable': false,
        'writable': false
    },
    'NEGATIVE_INFINITY': {
        'value': number.NEGATIVE_INFINITY,
        'writable': false,
        'enumerable': false,
        'configurable': false
    },
    'POSITIVE_INFINITY': {
        'value': number.POSITIVE_INFINITY,
        'writable': false,
        'enumerable': false,
        'configurable': false
    }
});