define(['builtin/testArguments',
        'builtin/testBoolean',
        'builtin/testFunction',
        'builtin/testNumber',
        'builtin/testObject',
        'builtin/testString'],
function() {
    Array.prototype.forEach.call(arguments, function(m) {
        m.module && module(m.module);
        m.tests.forEach(function(e){ test.apply(this, e); });
    });
});
