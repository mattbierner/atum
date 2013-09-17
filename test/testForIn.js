define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        Object = $.Id('Object'),
        defineProperty = $.Member(Object, $.Id('defineProperty'));

    return {
        'module': "For In Statement",
        'tests': [
            ["Zero Iteration For",
            function(){
                expect.run(
                    $.Program(
                        $.ForIn(a, $.Object(),
                            $.Expression($.Number(1)))))
                    
                    .testResult()
                        .type('undefined', undefined);
                
                expect.run(
                    $.Program(
                        $.ForIn($.Var($.Declarator($.Id('a'))), $.Object(),
                            $.Expression($.Number(1)))))
                    
                    .testResult()
                        .type('undefined', undefined)
                    
                    .test($.Expression(a))
                        .type('undefined', undefined);
            }],
            ["Zero Iteration Yielded Value",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Number(10)),
                        $.ForIn(a, $.Object(),
                            $.Expression($.Number(1)))))
                    .testResult()
                        .type('number', 10);
            }],
            ["Simple Object Iteration",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(0))),
                        $.Expression($.Assign(c, $.Object(
                                {'key':$.String('x'), 'kind': 'init', 'value': $.Number(1)},
                                {'key':$.String('y'), 'kind': 'init', 'value': $.Number(2)}))),
                        $.ForIn(a, c,
                            $.Expression($.AddAssign(b, $.ComputedMember(c, a))))))
                            
                    .testResult()
                        .type('number', '3')
                        
                    .test($.Expression(a))
                        .type('string', 'y')
            }],
            ["Member Lhs",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Object())),
                        $.Expression($.Assign(b, $.Number(0))),
                        $.Expression($.Assign(c, $.Object(
                            {'key':$.String('x'), 'kind': 'init', 'value': $.Number(1)},
                            {'key':$.String('y'), 'kind': 'init', 'value': $.Number(2)}))),
                        $.ForIn($.Member(a, $.Id('i')), c,
                            $.Expression($.AddAssign(b, $.ComputedMember(c, $.Member(a, $.Id('i'))))))))
                            
                    .testResult()
                        .type('number', '3')
                        
                    .test($.Expression($.Member(a, $.Id('i'))))
                        .type('string', 'y')
            }],
            ["Lhs revaluated every iteration",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign($.Id('i'), $.Number(0))),
                        $.Expression($.Assign(a, $.Object())),
                        $.Expression($.Assign(c, $.Object(
                            {'key':$.String('x'), 'kind': 'init', 'value': $.Number(1)},
                            {'key':$.String('y'), 'kind': 'init', 'value': $.Number(2)}))),
                        $.ForIn($.ComputedMember(a, $.PostIncrement($.Id('i'))), c,
                            $.Block())))
                        
                    .test($.Expression($.Member(a, $.Id('0'))))
                        .type('string', 'x')
                    
                    .test($.Expression($.Member(a, $.Id('1'))))
                        .type('string', 'y')
            }],
            
            ["Does not iterate over non enumerables",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign($.Id('i'), $.Number(0))),
                        $.Expression($.Assign(c, $.Object(
                            {'key': $.String('x'), 'kind': 'init', 'value': $.Number(1)}))),
                        $.Expression($.Call(defineProperty, [
                                c,
                                $.String('y'),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('value'),
                                    'value': $.Number(2)
                                }, {
                                    'kind': 'init',
                                    'key': $.String('enumerable'),
                                    'value': $.Boolean(false)
                                })])),
                        $.ForIn(a, c,
                            $.Expression($.PostIncrement($.Id('i'))))))
                        
                    .test($.Expression($.Id('i')))
                        .type('number', 1)
                    
                    .test($.Expression(a))
                        .type('string', 'x')
            }],
            ["Does not iterate over inherited",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(b, [],
                            $.Block(
                                $.Expression($.Assign($.Member($.This(), $.Id('x')), $.Number(1))))),
                        $.Expression($.Assign($.Member($.Member(b, $.Id('prototype')), $.Id('y')), $.Number(2))),
                        
                        $.Expression($.Assign($.Id('i'), $.Number(0))),
                        $.ForIn(a, $.New(b, []),
                            $.Expression($.PostIncrement($.Id('i'))))))
                        
                    .test($.Expression($.Id('i')))
                        .type('number', 1)
                    
                    .test($.Expression(a))
                        .type('string', 'x')
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
                        $.Assign(b, $.Number(0)),
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
                        $.Assign(b, $.Number(0)),
                        $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                            $.If($.Gt(a, $.Number(5)),
                                $.Block(
                                    $.Break(),
                                    $.Assign(a, $.Number(100))),
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
            
        ]
    };
});
