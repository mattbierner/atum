define(['ecma/ast/value',
        'atum/interpret'],
function(value,
        interpret){
    
    
    
    return {
        'module': "Literal Tests",
        'tests': [
            ["Number Literal",
            function(){
                var root = new value.Literal(null, 10, "number");
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
        ],
    };
});
