/**
 * @fileOverview Global builtins defined in the hosted language.
 */

/**
 * `isNaN(x)`
 */
Object.defineProperty(this, 'isNaN', {
    'value': function(x) {
        var num = +x;
        return (num !== num);
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});

/**
 * `isFinite(x)`
 */
Object.defineProperty(this, 'isFinite', {
    'value': function(x) {
        var num = +x;
        return (!isNaN(num) && num !== Infinity && num !== -Infinity);
    },
    'enumerable': false,
    'configurable': true,
    'writable': true
});
