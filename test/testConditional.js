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
    var c = new value.Identifier(null, 'c');

    return {
        'module': "Object Tests",
        'tests': [
            ["Simple If True Statement",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a)]),
                    new statement.IfStatement(
                        new value.Literal(null, true, 'boolean'),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('=',
                                a,
                                new value.Literal(null, 1, 'number')))),
                    new statement.ExpressionStatement(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Simple If false Statement",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a)]),
                    new statement.IfStatement(
                        new value.Literal(null, false, 'boolean'),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('=',
                                a,
                                new value.Literal(null, 1, 'number')))),
                    new statement.ExpressionStatement(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
            }],
            ["Simple If True Else Statement",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a)]),
                    new statement.IfStatement(
                        new value.Literal(null, true, 'boolean'),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('=',
                                a,
                                new value.Literal(null, 1, 'number'))),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('=',
                                a,
                                new value.Literal(null, 10, 'number')))),
                    new statement.ExpressionStatement(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Simple If False Else Statement",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a)]),
                    new statement.IfStatement(
                        new value.Literal(null, false, 'boolean'),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('=',
                                a,
                                new value.Literal(null, 1, 'number'))),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('=',
                                a,
                                new value.Literal(null, 10, 'number')))),
                    new statement.ExpressionStatement(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["If Statement True Test Side Effects",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(
                            a,
                            new value.Literal(null, 0, 'number'))]),
                    new statement.IfStatement(
                        new expression.UpdateExpression('++',
                            a,
                            true),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('+=',
                                a,
                                new value.Literal(null, 1, 'number'))),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('+=',
                                a,
                                new value.Literal(null, 10, 'number')))),
                    new statement.ExpressionStatement(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            ["If Statement False Test Side Effects",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(
                            a,
                            new value.Literal(null, 0, 'number'))]),
                    new statement.IfStatement(
                        new expression.UpdateExpression('++',
                            a,
                            false),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('+=',
                                a,
                                new value.Literal(null, 1, 'number'))),
                        new statement.ExpressionStatement(
                            new expression.AssignmentExpression('+=',
                                a,
                                new value.Literal(null, 10, 'number')))),
                    new statement.ExpressionStatement(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 11);
            }],
            
        ]
    };
});
