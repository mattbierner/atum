define(['ecma/ast/value',
        'ecma/ast/program',
        'ecma/ast/declaration',
        'ecma/ast/expression',
        'ecma/ast/statement',
        'atum/interpret'],
function(value,
        program,
        declaration,
        expression,
        statement,
        interpret){
    
    return {
        'module': "Binding Tests",
        'tests': [
            ["Simple Undefined Var",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                         new declaration.VariableDeclarator(new value.Identifier(null, 'a'))]),
                    new statement.ExpressionStatement(new value.Identifier(null, 'a'))]);
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
        ]
    };
});
