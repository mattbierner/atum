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
        'module': "Function Tests",
        'tests': [
            ["Empty Func Declaration",
            function(){
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [],
                        new statement.BlockStatement(null, [])),
                    new expression.CallExpression(null, a, [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Constant Func Declaration",
            function(){
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [],
                        new statement.BlockStatement(null, [
                            new statement.ReturnStatement(null, new value.Literal(null, 3, "number"))])),
                    new expression.CallExpression(null, a, [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Id Func Declaration",
            function(){
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b],
                        new statement.BlockStatement(null, [
                            new statement.ReturnStatement(null, b)])),
                    new expression.CallExpression(null, a, [
                      new value.Literal(null, 3, "number")])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Multiple Argument Func Declaration",
            function(){
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b, c],
                        new statement.BlockStatement(null, [
                            new statement.ReturnStatement(null,
                                new expression.BinaryExpression(null, '+', b, c))])),
                    new expression.CallExpression(null, a, [
                      new value.Literal(null, 1, "number"),
                      new value.Literal(null, 3, "number")])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 4);
            }],
            ["Undefined Argument",
            function(){
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b],
                        new statement.BlockStatement(null, [
                            new statement.ReturnStatement(null, b)])),
                    new expression.CallExpression(null, a, [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Argument Scope Leak Check",
            function(){
                // Make sure bound arguments are not accessible in calling scope.
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b],
                        new statement.BlockStatement(null, [])),
                    new expression.CallExpression(null, a, [new value.Literal(null, 1, "number")]),
                    new statement.ExpressionStatement(null, b)]);
                
                assert.throws(interpret.interpret.bind(undefined, root));
            }],
            
            ["Argument Alias Scope Check",
            function(){
                // Make sure closest bound value for argument is used.
                var root = new program.Program(null, [
                    new statement.ExpressionStatement(null, 
                        new expression.AssignmentExpression(null, '=', b, new value.Literal(null, 100, "number"))),
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b],
                        new statement.BlockStatement(null, [
                          new statement.ReturnStatement(null, b)])),
                    new expression.CallExpression(null, a, [new value.Literal(null, 1, "number")])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Dynamic Resolution In Scope Check",
            function(){
                // Check that variables in function scope are resolved to current
                // values, not values when function declared.
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                         new declaration.VariableDeclarator(null, b)]),
                    new declaration.FunctionDeclaration(null,
                        a,
                        [],
                        new statement.BlockStatement(null, [
                          new statement.ReturnStatement(null, b)])),
                    new statement.ExpressionStatement(null, 
                        new expression.AssignmentExpression(null, '=', b, new value.Literal(null, 1, "number"))),
                    new expression.BinaryExpression(null, '+',
                        // b resolves to 1
                        new expression.CallExpression(null, a, []), 
                        // b resolves to 3
                        new expression.CallExpression(null, a, [
                               new expression.AssignmentExpression(null, '=', b, new value.Literal(null, 3, "number"))]))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 4);
            }],
            
            ["Closure Argument Check",
            function(){
                // Checks that argument passed in can be used in returned function.
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b],
                        new statement.BlockStatement(null, [
                          new statement.ReturnStatement(null, 
                              new expression.FunctionExpression(
                                  null,
                                  null,
                                  [],
                                  new statement.BlockStatement(null, [
                                      new statement.ReturnStatement(null, b)])))])),
                    new expression.CallExpression(null, 
                        new expression.CallExpression(null, a, [new value.Literal(null, 1, "number")]),
                        [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Closure Variable Check",
            function(){
                // Checks that variable defines in function scope is accessible in closure.
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [],
                        new statement.BlockStatement(null, [
                            new declaration.VariableDeclaration(null, [
                                new declaration.VariableDeclarator(null, b,
                                    new value.Literal(null, 1, "number"))]),
                          new statement.ReturnStatement(null,
                              new expression.FunctionExpression(
                                  null,
                                  null,
                                  [],
                                  new statement.BlockStatement(null, [
                                      new statement.ReturnStatement(null, b)])))])),
                    new expression.CallExpression(null, 
                        new expression.CallExpression(null, a, []),
                        [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            
            ["External Assignment Check",
            function(){
                // Checks that variable assignment for external scope modifies
                // that variable.
                var root = new program.Program(null, [
                    new statement.ExpressionStatement(null, 
                        new expression.AssignmentExpression(null, '=', b, new value.Literal(null, 0, "number"))),
                    new declaration.FunctionDeclaration(null,
                        a,
                        [],
                        new statement.BlockStatement(null, [
                           new expression.AssignmentExpression(null, '=', b, new value.Literal(null, 10, "number"))])),
                        new expression.CallExpression(null, a, []),
                        new statement.ExpressionStatement(null, b)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            
             
            ["Values passed by value",
            function(){
                // Checks that arguments primitive values are passed by value
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b],
                        new statement.BlockStatement(null, [
                           new expression.AssignmentExpression(null, '=', b, new value.Literal(null, 10, "number"))])),
                    new statement.ExpressionStatement(null, 
                        new expression.AssignmentExpression(null, '=', b, new value.Literal(null, 2, "number"))),
                    new expression.CallExpression(null, a, [b]),
                    new statement.ExpressionStatement(null, b)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            
            ["Objects passed by reference",
            function(){
                // Checks that argument object values are passed by reference
                // but that environment binding still acts correctly.
                var root = new program.Program(null, [
                    new declaration.FunctionDeclaration(null,
                        a,
                        [b],
                        new statement.BlockStatement(null, [
                           new expression.AssignmentExpression(null, '=',
                               new expression.MemberExpression(null, b, c),
                               new value.Literal(null, 10, "number")),
                           new expression.AssignmentExpression(null, '=',
                               b,
                               new value.Literal(null, 1, "number"))])),
                    new statement.ExpressionStatement(null, 
                        new expression.AssignmentExpression(null, '=',
                            b,
                            new expression.ObjectExpression(null, [
                                 {
                                     'kind': 'init',
                                     'key': new value.Literal(null, 'c', 'string'),
                                     'value': new value.Literal(null, 1, 'number')
                                 }
                             ]))),
                    new expression.CallExpression(null, a, [b]),
                    new statement.ExpressionStatement(null, 
                        new expression.MemberExpression(null, b, c))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            
        ]
    };
});
