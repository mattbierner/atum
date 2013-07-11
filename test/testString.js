define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    return {
        'module': "String",
        'tests': [
            ["String Literal",
            function(){
                (["", "abc", '""', "''", "a\nb", "e\u0041ab"]).forEach(function(x) {
                    var result = interpret.evaluate($.String(x));
                    assert.equal(result.type, 'string');
                    assert.equal(result.value, x);
                });
            }],
            ["Binary Plus String, Both Sides",
            function(){
               ([['', 'abc'], ['abc', ''], ['ab', 'c']]).forEach(function(x) {
                    var result = interpret.evaluate($.Add(
                        $.String(x[0]),
                        $.String(x[1])));
                    assert.equal(result.type, 'string');
                    assert.equal(result.value, x[0] + x[1]);
                });
            }],
            ["Binary Plus String Force String Conversion",
            function(){
                var lresult = interpret.evaluate($.Add(
                    $.Number(10),
                    $.String("abc")));
                
                assert.equal(lresult.type, 'string');
                assert.equal(lresult.value, "10abc");
                
                var rresult = interpret.evaluate($.Add(
                    $.String("abc"),
                    $.Number(10)));
                
                assert.equal(rresult.type, 'string');
                assert.equal(rresult.value, "abc10");
            }],
        ],
    };
});
