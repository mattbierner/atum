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
    
    var a = $.Id('a');
    var b = $.Id('b');
    
    return {
        'module': "Binding Tests",
        'tests': [
            ["Simple Undefined Var",
            function(){
                var root = $.Program(
                    $.Var(
                         $.Declarator(a)),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Simple Init Var",
            function(){
                var root = $.Program(
                    $.Var(
                         $.Declarator(a, $.Number(10))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Multiple Variable Declaration",
            function(){
                var root = $.Program(
                    $.Var(
                         $.Declarator(a, $.Number(1)),
                         $.Declarator(b, $.Number(2))),
                    $.Expression($.Add(a, b)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Multiple Variable Declaration",
            function(){
                var root = $.Program(
                    $.Var(
                         new declaration.VariableDeclarator(
                             null,
                             a,
                             $.Number(1))),
                     $.Var(
                         new declaration.VariableDeclarator(
                             null,
                             b,
                             $.Number(2))),
                    new statement.ExpressionStatement(
                        null,
                        new expression.BinaryExpression(null, '+', a, b)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            
            ["Var Declaration init to undefined",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a, b)),
                     $.Var(
                         $.Declarator(b)),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            
        // Global
            ["Global assignment",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign( a, $.Number(1))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Global this assignment",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign(
                            new expression.MemberExpression(null,
                                $.This(),
                                a,
                                false),
                            $.Number(1))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
        ]
    };
});
