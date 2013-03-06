define(['ecma/ast/value',
        'ecma/ast/expression',
        'atum/interpret'],
function(value,
        expression,
        interpret){
    
    return {
        'module': "Unary Tests",
        'tests': [
            ["Void",
            function(){
                var root = new expression.UnaryExpression('void', new value.Literal(null, 10, "number"));
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
             ["Void Side Effects",
            function(){
                var root = new expression.SequenceExpression([
                  new expression.AssignmentExpression('=',
                      new value.Identifier(null, 'a'),
                      new value.Literal(null, 0, 'number')),
                  new expression.UnaryExpression('void',
                      new expression.UpdateExpression(
                          '++',
                          new value.Identifier(null, 'a')),
                          true),
                  new value.Identifier(null, 'a')]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, '1');
                assert.equal(result.value, 'number');
            }],
        ],
    };
});
