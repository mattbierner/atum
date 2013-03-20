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
            ["Simple Object Expression",
            function(){
                var decl = new declaration.VariableDeclaration([
                    new declaration.VariableDeclarator(a,
                        new expression.ObjectExpression([
                             {
                                 'kind': 'init',
                                 'key': new value.Literal(null, 'b', 'string'),
                                 'value': new value.Literal(null, 1, 'number')
                             }
                         ]))]);
                
                var nonComputedRoot = new program.Program([
                    decl,
                    new statement.ExpressionStatement(
                        new expression.MemberExpression(a, b, false))]);
                
                var nonComputedresult = interpret.interpret(nonComputedRoot);
                assert.equal(nonComputedresult.type, 'number');
                assert.equal(nonComputedresult.value, 1);
                
                var computedRoot = new program.Program([
                    decl,
                    new statement.ExpressionStatement(
                        new expression.MemberExpression(a, new value.Literal(null, 'b', 'string'), true))]);
                
                var computedResult = interpret.interpret(computedRoot);
                assert.equal(computedResult.type, 'number');
                assert.equal(computedResult.value, 1);
            }],
            ["Non Member Object Expression",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a,
                            new expression.ObjectExpression([]))]),
                    new statement.ExpressionStatement(
                        new expression.MemberExpression(a, b, false))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Multiple Duplicate Property Member Object Expression",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a,
                            new expression.ObjectExpression([
                                 {
                                     'kind': 'init',
                                     'key': new value.Literal(null, 'b', 'string'),
                                     'value': new value.Literal(null, 1, 'number')
                                 },
                                 {
                                     'kind': 'init',
                                     'key': new value.Literal(null, 'b', 'string'),
                                     'value': new value.Literal(null, 2, 'number')
                                 }
                             ]))]),
                    new statement.ExpressionStatement(
                        new expression.MemberExpression(a, b, false))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            ["Getter Property Member Object Expression",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a,
                            new expression.ObjectExpression([
                                 {
                                     'kind': 'get',
                                     'key': new value.Literal(null, 'b', 'string'),
                                     'value': new expression.FunctionExpression(
                                         null,
                                         [],
                                         new statement.BlockStatement([
                                            new statement.ReturnStatement(
                                                new value.Literal(null, 1, 'number'))
                                         ]))
                                 }
                             ]))]),
                    new statement.ExpressionStatement(
                        new expression.MemberExpression(a, b, false))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Getter This Property Member Object Expression",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a,
                            new expression.ObjectExpression([
                                 {
                                     'kind': 'init',
                                     'key': new value.Literal(null, 'c', 'string'),
                                     'value': new value.Literal(null, 1, 'number')
                                 },
                                 {
                                     'kind': 'get',
                                     'key': new value.Literal(null, 'b', 'string'),
                                     'value': new expression.FunctionExpression(
                                         null,
                                         [],
                                         new statement.BlockStatement([
                                            new statement.ReturnStatement(
                                                new expression.MemberExpression(
                                                    new expression.ThisExpression(),
                                                    c,
                                                    false))
                                         ]))
                                 }
                             ]))]),
                    new statement.ExpressionStatement(
                        new expression.MemberExpression(a, b, false))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            
            ["Objects passed by reference",
            function(){
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                        new declaration.VariableDeclarator(a,
                            new expression.ObjectExpression([
                                 {
                                     'kind': 'init',
                                     'key': new value.Literal(null, 'c', 'string'),
                                     'value': new value.Literal(null, 1, 'number')
                                 }
                             ])),
                             new declaration.VariableDeclarator(b, a)]),
                     new statement.ExpressionStatement(
                         new expression.AssignmentExpression('=',
                             new expression.MemberExpression(a, c, false),
                             new value.Literal(null, 2, 'number'))),
                    new statement.ExpressionStatement(
                        new expression.MemberExpression(b, c, false))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
        ]
    };
});
