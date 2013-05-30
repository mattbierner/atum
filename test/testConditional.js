define(['$',
        'ecma/ast/value',
        'ecma/ast/program',
        'ecma/ast/declaration',
        'ecma/ast/expression',
        'ecma/ast/statement',
        'atum/interpret'],
function($,
        value,
        program,
        declaration,
        expression,
        statement,
        interpret){
    
    var a = new value.Identifier(null, 'a');
    var b = new value.Identifier(null, 'b');
    var c = new value.Identifier(null, 'c');

    return {
        'module': "Conditional Tests",
        'tests': [
            ["Simple If True Statement",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                        new declaration.VariableDeclarator(null, a)]),
                    $.If(
                        $.Boolean(true),
                        $.Expression(
                            $.Assign(
                                a,
                                $.Number(1)))),
                    $.Expression(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Simple If false Statement",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                        new declaration.VariableDeclarator(null, a)]),
                    $.If(
                        $.Boolean(false),
                        $.Expression(
                            $.Assign(
                                a,
                                $.Number(1)))),
                    $.Expression(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
            }],
            ["Simple If True Else Statement",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                        new declaration.VariableDeclarator(null, a)]),
                    $.If(
                        $.Boolean(true),
                        $.Expression(
                            $.Assign(
                                a,
                                $.Number(1))),
                        $.Expression(
                            $.Assign(
                                a,
                                $.Number(10)))),
                    $.Expression(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Simple If False Else Statement",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                        new declaration.VariableDeclarator(null, a)]),
                    $.If(
                        $.Boolean(false),
                        $.Expression(
                            $.Assign(
                                a,
                                $.Number(1))),
                        $.Expression(
                            $.Assign(
                                a,
                                $.Number(10)))),
                    $.Expression(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["If Statement True Test Side Effects",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                        new declaration.VariableDeclarator(null, 
                            a,
                            $.Number(0))]),
                    $.If(
                        new expression.UpdateExpression(null, '++',
                            a,
                            true),
                        $.Expression(
                            new expression.AssignmentExpression(null, '+=',
                                a,
                                $.Number(1))),
                        $.Expression(
                            new expression.AssignmentExpression(null, '+=',
                                a,
                                $.Number(10)))),
                    $.Expression(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            ["If Statement False Test Side Effects",
            function(){
                var root = new program.Program(null, [
                    new declaration.VariableDeclaration(null, [
                        new declaration.VariableDeclarator(null, 
                            a,
                            $.Number(0))]),
                    $.If(
                        new expression.UpdateExpression(null, '++',
                            a,
                            false),
                        $.Expression(
                            new expression.AssignmentExpression(null, '+=',
                                a,
                                $.Number(1))),
                        $.Expression(
                            new expression.AssignmentExpression(null, '+=',
                                a,
                                $.Number(10)))),
                    $.Expression(a)]);
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 11);
            }],
            
        ]
    };
});
