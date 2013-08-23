define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a');
    var b = $.Id('b');
    
    return {
        'module': "Environment",
        'tests': [
            ["Simple Undefined Var",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a)),
                        $.Expression(a)))
                    .testResult()
                        .type('undefined', undefined);
            }],
            ["Simple Init Var",
            function(){
                var root = $.Program(
                    $.Var(
                         $.Declarator(a, $.Number(10))),
                    $.Expression(a));
                
                var result = interpret.evaluate(root);
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
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Multiple Variable Declaration",
            function(){
                var root = $.Program(
                    $.Var(
                         $.Declarator(a, $.Number(1))),
                     $.Var(
                         $.Declarator(b, $.Number(2))),
                    $.Expression($.Add(a, b)));
                
                var result = interpret.evaluate(root);
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
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            
            ["Delete var removes binding",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(10))),
                        $.Expression($.Delete(a)),
                        $.Expression(a)))
                    .isError();
            }],
            
        // Global
            ["Global assignment",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign( a, $.Number(1))),
                    $.Expression(a));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Global this assignment",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign(
                            $.Member($.This(), a),
                            $.Number(1))),
                    $.Expression(a));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
        ]
    };
});
