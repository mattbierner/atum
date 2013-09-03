define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    return {
        'module': "While",
        'tests': [
            ["Zero Iteration While",
            function(){
                // returns undefined
                expect.run(
                    $.Program(
                        $.While($.Boolean(false),
                            $.Expression($.Number(1)))))
                        
                    .testResult()
                        .type('undefined', undefined);
                
                // Test run once
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(0))),
                        $.While($.PostIncrement(a),
                            $.Expression($.Number(10)))))
                        
                    .test($.Expression(a))
                        .type('number', 1);
            }],
            ["Return Last Iteration Body Value",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(0))),
                        $.While($.Lt($.PostIncrement(a), $.Number(5)), 
                            $.Expression(a))))
                            
                    .testResult()
                        .type('number', 5);
            }],
            ["Nested While",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(2))),
                        $.While($.Lt(a, $.Number(100)),
                            $.Block(
                                $.Expression($.Assign(b, a)),
                                $.While($.Lt(a, $.Mul(b, b)),
                                    $.Expression($.Assign(a, $.Mul(a, a))))))))
                                    
                    .testResult()
                        .type('number', 256);
            }],
            ["Continue",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(0))),
                        $.Expression($.Assign(a, $.Number(0))),
                        $.While($.Lt(a, $.Number(10)),
                            $.If($.Mod($.PostIncrement(a), $.Number(2)),
                                $.Continue(),
                                $.Expression($.PreIncrement(b))))))
                                
                    .test($.Expression(b))
                        .type('number', 5);
            }],
            ["Continue Yielded Value",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(0))),
                        $.While($.Lt(a, $.Number(10)),
                            $.Block(
                                $.Expression($.PostIncrement(a)),
                                $.Continue()))))
                        
                    .testResult()
                        .type('number', 9);
            }],
            ["Continue Yielded Value across iterations",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(0))),
                        $.While($.Lt(a, $.Number(10)),
                            $.Block(
                                $.If($.Mod($.PostIncrement(a), $.Number(2)),
                                    $.Continue(),
                                    $.Expression($.Mul(a, a)))))))
                                    
                    .testResult()
                        .type('number', 81);
            }],
            ["Nested While Continue",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(0))),
                        $.While($.Lt(a, $.Number(3)),
                            $.Block(
                                $.For($.Assign(b, $.Number(0)), $.Lt(b, $.Number(4)), $.PreIncrement(b),
                                    $.Block(
                                        $.If($.Mod(a, $.Number(2)),
                                            $.Continue(),
                                            $.Expression($.Mul(a, b))))),
                                 $.Expression($.PreIncrement(a))))))
                                 
                     .testResult()
                         .type('number', 3);
            }],
            /*
            ["Break",
            function(){
                expect.run($.Program(
                    $.Assign(b, $.Number(0)),
                    $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                        $.If($.Gt(a, $.Number(5)),
                            $.Block(
                                $.Break(),
                                $.Assign(a, $.Number(100))),
                            $.Expression($.PreIncrement(b)))),
                    $.Expression(b));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],
            ["update not run after break",
            function(){
                expect.run($.Program(
                    $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                        $.If($.Gt(a, $.Number(5)),
                            $.Break())),
                    $.Expression(a));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],
            ["Break Yielded value",
            function(){
                expect.run($.Program(
                    $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                        $.If($.Gt(a, $.Number(5)),
                            $.Block(
                                $.Expression(a),
                                $.Break()))));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],
            ["Break Across Iterations Yielded value",
            function(){
                expect.run($.Program(
                    $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                        $.If($.Gte(a, $.Number(4)),
                            $.Break(),
                            $.Expression(a))));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 3);
            }],
            ["Nested Break",
            function(){
                expect.run($.Program(
                    $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(3)), $.PreIncrement(a),
                        $.Block(
                            $.For($.Assign(b, $.Number(0)), null, $.PreIncrement(b),
                                $.Block(
                                    $.If($.Gte(b, $.Number(4)),
                                        $.Break(),
                                        $.Expression($.Mul(a, b))))))));
                
                var result = interpret.evaluate(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],*/
        ]
    };
});
