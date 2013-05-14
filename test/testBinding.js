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
    
    var a = new value.Identifier(null, 'a');
    var b = new value.Identifier(null, 'b');
    
    return {
        'module': "Binding Tests",
        'tests': [
            ["Simple Undefined Var",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                         new declaration.VariableDeclarator(null, a)]),
                    new statement.ExpressionStatement(null, a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Simple Init Var",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                         new declaration.VariableDeclarator(
                             null,
                             a,
                             new value.Literal(null, 10, "number"))]),
                    new statement.ExpressionStatement(null, a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Multiple Variable Declaration",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                         new declaration.VariableDeclarator(
                             null,
                             a,
                             new value.Literal(null, 1, "number")),
                         new declaration.VariableDeclarator(
                             null,
                             b,
                             new value.Literal(null, 2, "number"))]),
                    new statement.ExpressionStatement(null, new expression.BinaryExpression(null, '+',
                        a,
                        b))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Multiple Variable Declaration",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                         new declaration.VariableDeclarator(
                             null,
                             a,
                             new value.Literal(null, 1, "number"))]),
                     new declaration.VariableDeclaration(null, [
                         new declaration.VariableDeclarator(
                             null,
                             b,
                             new value.Literal(null, 2, "number"))]),
                    new statement.ExpressionStatement(
                        null,
                        new expression.BinaryExpression(null, '+', a, b))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            
            ["Var Declaration init to undefined",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                        new declaration.VariableDeclarator(null, a, b)]),
                     new declaration.VariableDeclaration(null, [
                         new declaration.VariableDeclarator(null, b)]),
                    new statement.ExpressionStatement(null, a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            
        // Global
            ["Global assignment",
            function(){
                var root = new program.Program(null, [
                    new statement.ExpressionStatement(null,
                        new expression.AssignmentExpression(null, '=', a, new value.Literal(null, 1, "number"))),
                    new statement.ExpressionStatement(null, a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Global this assignment",
            function(){
                var root = new program.Program(null, [
                    new statement.ExpressionStatement(null,
                        new expression.AssignmentExpression(null, '=',
                            new expression.MemberExpression(null,
                                new expression.ThisExpression(null),
                                a,
                                false),
                            new value.Literal(null, 1, "number"))),
                    new statement.ExpressionStatement(null, a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
        ]
    };
});
