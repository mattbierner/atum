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
            ["Hiding Variable Declaration",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(1))),
                         $.Var(
                             $.Declarator(b, a),
                             $.Declarator(a, $.Number(2)))))
                     
                    .test($.Expression(a))
                        .type('number', 2)
                    
                    .test($.Expression(b))
                        .type('number', 1);
            }],
            
            ["Var Declaration init to undefined",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a, b)),
                         $.Var(
                             $.Declarator(b))))
                     
                    .test($.Expression(a))
                        .type('undefined', undefined);
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
            ["Delete reassign",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(10))),
                        $.Expression($.Delete(a)),
                        $.Var(
                             $.Declarator(a, $.Number(15))),
                        $.Expression(a)))
                    .testResult()
                        .type('number', 15);
            }],
            ["Delete var return type",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(10))),
                        $.Expression($.Delete(a))))
                    .testResult()
                        .type('boolean', true);
            }],
            ["Delete non var",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Delete($.Number(1)))))
                    .testResult()
                        .type('boolean', true);
            }],
            ["Delete undefined var",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Delete(a))))
                    .testResult()
                        .type('boolean', true);
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
