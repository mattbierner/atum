/**
 * @fileOverview Number builtins defined in the hosted language.
 */
"use strict";

/**
 * `RegExp.prototype.test(string)`
 */
Object.defineProperty(RegExp.prototype, 'test', {
    'value': function(string) {
        var match = RegExp.prototype.exec.call(this, string);
        return (match !== null);
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});