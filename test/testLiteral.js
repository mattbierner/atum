define(['ecma/ast/value',
        'atum/interpret'],
function(value,
        interpret){
    
    
    
    return {
        'module': "Literal Tests",
        'tests': [
            ["Number Literal",
            function(){
                ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                        var result = interpret.interpret(new value.Literal(null, x, "number"));
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, x);
                    });
            }],
            ["String Literal",
            function(){
                (["", "abc"])
                    .forEach(function(x) {
                        var result = interpret.interpret(new value.Literal(null, x, "string"));
                        assert.equal(result.type, 'string');
                        assert.deepEqual(result.value, x);
                    });
            }],
        ],
    };
});
