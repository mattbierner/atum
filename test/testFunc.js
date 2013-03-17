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
            
            
            
        ]
    };
});
