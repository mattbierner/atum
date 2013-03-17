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
                var root = new program.Program([
                    new declaration.FunctionDeclaration(
                        a,
                        [],
                        new statement.BlockStatement([])),
                    new expression.CallExpression(a, [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Constant Func Declaration",
            function(){
                var root = new program.Program([
                    new declaration.FunctionDeclaration(
                        a,
                        [],
                        new statement.BlockStatement([
                            new statement.ReturnStatement(new value.Literal(null, 3, "number"))])),
                    new expression.CallExpression(a, [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Id Func Declaration",
            function(){
                var root = new program.Program([
                    new declaration.FunctionDeclaration(
                        a,
                        [b],
                        new statement.BlockStatement([
                            new statement.ReturnStatement(b)])),
                    new expression.CallExpression(a, [
                      new value.Literal(null, 3, "number")])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Multiple Argument Func Declaration",
            function(){
                var root = new program.Program([
                    new declaration.FunctionDeclaration(
                        a,
                        [b, c],
                        new statement.BlockStatement([
                            new statement.ReturnStatement(
                                new expression.BinaryExpression('+', b, c))])),
                    new expression.CallExpression(a, [
                      new value.Literal(null, 1, "number"),
                      new value.Literal(null, 3, "number")])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 4);
            }],
            ["Undefined Argument",
            function(){
                var root = new program.Program([
                    new declaration.FunctionDeclaration(
                        a,
                        [b],
                        new statement.BlockStatement([
                            new statement.ReturnStatement(b)])),
                    new expression.CallExpression(a, [])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Argument Scope Leak Check",
            function(){
                // Make sure bound arguments are not accessible in calling scope.
                var root = new program.Program([
                    new declaration.FunctionDeclaration(
                        a,
                        [b],
                        new statement.BlockStatement([])),
                    new expression.CallExpression(a, [new value.Literal(null, 1, "number")]),
                    new statement.ExpressionStatement(b)]);
                
                assert.throws(interpret.interpret.bind(undefined, root));
            }],
            
            ["Argument Alias Scope Check",
            function(){
                // Make sure closest bound value for argument is used.
                var root = new program.Program([
                    new statement.ExpressionStatement(
                        new expression.AssignmentExpression('=', b, new value.Literal(null, 100, "number"))),
                    new declaration.FunctionDeclaration(
                        a,
                        [b],
                        new statement.BlockStatement([
                          new statement.ReturnStatement(b)])),
                    new expression.CallExpression(a, [new value.Literal(null, 1, "number")])]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Dynamic Resolution In Scope Check",
            function(){
                // Check that variables in function scope are resolved to current
                // values not values when function declared.
                var root = new program.Program([
                    new declaration.VariableDeclaration([
                         new declaration.VariableDeclarator(b)]),
                    new declaration.FunctionDeclaration(
                        a,
                        [],
                        new statement.BlockStatement([
                          new statement.ReturnStatement(b)])),
                    new statement.ExpressionStatement(
                        new expression.AssignmentExpression('=', b, new value.Literal(null, 1, "number"))),
                    new expression.BinaryExpression('+',
                        // b resolves to 1
                        new expression.CallExpression(a, []), 
                        // b resolves to 3
                        new expression.CallExpression(a, [
                               new expression.AssignmentExpression('=', b, new value.Literal(null, 3, "number"))]))]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 4);
            }],
            
        ]
    };
});
