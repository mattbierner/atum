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
            ["Simple Init Var",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                         new declaration.VariableDeclarator(
                             new value.Identifier(null, 'a'),
                             new value.Literal(null, 10, "number"))]),
                    new statement.ExpressionStatement(new value.Identifier(null, 'a'))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Multiple Variable Declaration",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                         new declaration.VariableDeclarator(
                             new value.Identifier(null, 'a'),
                             new value.Literal(null, 1, "number")),
                         new declaration.VariableDeclarator(
                             new value.Identifier(null, 'b'),
                             new value.Literal(null, 2, "number"))]),
                    new statement.ExpressionStatement(new expression.BinaryExpression('+',
                        new value.Identifier(null, 'a'),
                        new value.Identifier(null, 'b')))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Multiple Variable Declaration",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                         new declaration.VariableDeclarator(
                             new value.Identifier(null, 'a'),
                             new value.Literal(null, 1, "number"))]),
                     new declaration.VariableDeclaration([
                         new declaration.VariableDeclarator(
                             new value.Identifier(null, 'b'),
                             new value.Literal(null, 2, "number"))]),
                    new statement.ExpressionStatement(new expression.BinaryExpression('+',
                        new value.Identifier(null, 'a'),
                        new value.Identifier(null, 'b')))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
        ]
    };
});
