define(['ecma/ast/value',
        'ecma/ast/expression',
        'atum/interpret'],
function(value,
        expression,
        interpret){
    
    return {
        'module': "Binary Tests",
        'tests': [
        // Binary plus
            ["Binary Plus Number",
            function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                        var root = new expression.BinaryExpression(null, '+',
                            new value.Literal(null, x, "number"),
                            new value.Literal(null, 10, "number"));
                        var result = interpret.interpret(root);
                        assert.equal(result.type, 'number');
                        assert.equal(result.value, x + 10);
                    });
            }],
      
        ],
    };
});
