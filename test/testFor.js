define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    return {
        'module': "For",
        'tests': [
            ["Zero Iteration For",
            function(){
                expect.run(
                    $.Program(
                        $.For(null, $.Boolean(false), null,
                            $.Expression($.Number(1)))))
                    
                    .testResult()
                        .type('undefined', undefined);
                
                // Init run and test one run once
               expect.run(
                   $.Program(
                        $.For($.Assign(a, $.Number(0)), $.PostIncrement(a), null,
                            $.Expression($.Number(10))),
                        $.Expression(a)))
                    
                    .testResult()
                        .type('number', 1);
            }],
            ["Zero Iteration Yielded Value",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Number(10)),
                        $.For(null, $.Boolean(false), null,
                            $.Expression($.Number(1)))))
                    .testResult()
                        .type('number', 10);
            }],
            ["Return Last Iteration Body Value",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(5)), $.PreIncrement(a),
                            $.Expression(a))))
                            
                    .testResult()
                        .type('number', 4);
            }],
            ["Init run once, test run iteration + 1 times",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), $.Lt($.PostIncrement(a), $.Number(5)), null,
                            $.Expression(a))))
                    
                    .testResult()
                        .type('number', 5);
            }],
            ["Nested For",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), $.Lt($.PostIncrement(a), $.Number(3)), null,
                            $.For($.Assign(b, $.Number(0)), $.Lt($.PostIncrement(b), $.Number(4)), null,
                                $.Expression($.Mul(a, b))))))
                    
                    .testResult()
                        .type('number', 12);
            }],
            ["Continue",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(0))),
                        $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(10)), $.PreIncrement(a),
                            $.If($.Mod(a, $.Number(2)),
                                $.Continue(),
                                $.Expression($.PreIncrement(b))))))
                    
                    .test($.Expression(b))
                        .type('number', 5);
            }],
            ["Continue Yielded Value",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(10)), $.PreIncrement(a),
                            $.Block(
                                $.Expression(a),
                                $.Continue()))))
                                
                    .testResult()
                        .type('number', 9);
            }],
            ["Continue Yielded Value across iterations",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(10)), $.PreIncrement(a),
                            $.Block(
                                $.If($.Mod(a, $.Number(2)),
                                    $.Continue(),
                                    $.Expression(a))))))
                                    
                    .testResult()
                        .type('number', 8);
            }],
            ["Nested For Continue",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(3)), $.PreIncrement(a),
                            $.Block(
                                $.For($.Assign(b, $.Number(0)), $.Lt(b, $.Number(4)), $.PreIncrement(b),
                                    $.Block(
                                        $.If($.Mod(a, $.Number(2)),
                                            $.Continue(),
                                            $.Expression($.Mul(a, b)))))))))
                    .testResult()
                        .type('number', 6);
            }],
            ["Break",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(0))),
                        $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                            $.If($.Gt(a, $.Number(5)),
                                $.Block(
                                    $.Break(),
                                    $.Expression($.Assign(a, $.Number(100)))),
                                $.Expression($.PreIncrement(b))))))
                    
                    .test($.Expression(b))
                        .type('number', 6);
            }],
            ["update not run after break",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                            $.If($.Gt(a, $.Number(5)),
                                $.Break()))))
                                
                    .test($.Expression(a))
                        .type('number', 6);

            }],
            ["Break Yielded value",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                            $.If($.Gt(a, $.Number(5)),
                                $.Block(
                                    $.Expression(a),
                                    $.Break())))))
                                
                    .testResult()
                        .type('number', 6);
            }],
            ["Break Across Iterations Yielded value",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                            $.If($.Gte(a, $.Number(4)),
                                $.Break(),
                                $.Expression(a)))))
                        
                    .testResult()
                        .type('number', 3);
            }],
            ["Nested Break",
            function(){
                expect.run(
                    $.Program(
                        $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(3)), $.PreIncrement(a),
                            $.Block(
                                $.For($.Assign(b, $.Number(0)), null, $.PreIncrement(b),
                                    $.Block(
                                        $.If($.Gte(b, $.Number(4)),
                                            $.Break(),
                                            $.Expression($.Mul(a, b)))))))))
                    .testResult()
                        .type('number', 6);

            }],
            
            ["Return Inside For",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                                    $.If($.Gt(a, $.Number(5)),
                                        $.Return(a)))))))
                            
                    .test($.Expression($.Call(a, [])))
                        .type('number', 6);
            }],
            
            ["Init throws",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [], $.Block($.Throw($.Null()))),
                        $.Expression($.Assign(b, $.Number(6))),
                        $.Try(
                            $.For($.Call(a, []), $.Lt($.PreIncrement(b), $.Number(5)), $.PreIncrement(b),
                                $.Expression($.PreIncrement(b))),
                            $.Catch(c,
                                $.Block()))))
                            
                    .testResult()
                        .type('number', 6)
                        
                    .testResult($.Expression(b))
                        .type('number', 6);
            }],
            ["Test throws",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [], $.Block($.Throw($.Null()))),
                        $.Try(
                            $.For($.Assign(b, $.Number(0)), $.Lt($.PreIncrement(b), $.Call(a, [])), $.AddAssign(b, $.Number(10)),
                                $.Expression($.PreIncrement(b))),
                            $.Catch(c,
                                $.Block($.Expression($.String('abc')))))))
                                            
                    .testResult()
                        .type('string', 'abc')
                
                    .test($.Expression(b))
                        .type('number', 1);
            }],
            ["Update throws",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [], $.Block($.Throw($.Null()))),
                        $.Try(
                            $.For($.Assign(b, $.Number(0)), $.Lt(b, $.Number(10)), $.Call(a, []),
                                $.Expression($.PreIncrement(b))),
                            $.Catch(c,
                                $.Block($.Expression($.String('abc')))))))
                                            
                    .testResult()
                        .type('string', 'abc')
                
                    .test($.Expression(b))
                        .type('number', 1);
            }],
        ]
    };
});
