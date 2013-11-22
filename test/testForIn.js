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
                        $.ForIn($.Var($.Declarator(a)), $.Object(),
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
                            $.ObjectValue($.String('x'), $.Number(1)),
                            $.ObjectValue($.String('y'), $.Number(2))))),
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
                            $.ObjectValue($.String('x'), $.Number(1)),
                            $.ObjectValue($.String('y'), $.Number(2))))),
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
                                $.ObjectValue($.String('x'), $.Number(1)),
                                $.ObjectValue($.String('y'), $.Number(2))))),
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
                            $.ObjectValue($.String('x'), $.Number(1))))),
                        $.Expression($.Call(defineProperty, [
                                c,
                                $.String('y'),
                                $.Object(
                                    $.ObjectValue($.String('value'), $.Number(2)),
                                    $.ObjectValue($.String('enumerable'), $.Boolean(false)))])),
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
            
            ["Continue",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(0))),
                        $.Expression($.Assign(c, $.Object(
                                $.ObjectValue($.String('x'), $.Number(1)),
                                $.ObjectValue($.String('y'), $.Number(2)),
                                $.ObjectValue($.String('ya'), $.Number(10)),
                                $.ObjectValue($.String('z'), $.Number(3))))),
                        $.ForIn(a, c,
                            $.Block(
                                $.If($.Equals($.ComputedMember(a, $.Number(0)), $.String('y')),
                                    $.Expression($.AddAssign(b, $.ComputedMember(c, a))),
                                    $.Continue())))))
                            
                    .testResult()
                        .type('number', '12')
                        
                    .test($.Expression(a))
                        .type('string', 'z')
                        
                    .test($.Expression(b))
                        .type('number', '12')
            }],
            
            ["Break",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(0))),
                        $.Expression($.Assign(c, $.Object(
                                $.ObjectValue($.String('x'), $.Number(1)),
                                $.ObjectValue($.String('y'), $.Number(2)),
                                $.ObjectValue($.String('ya'), $.Number(10)),
                                $.ObjectValue($.String('z'), $.Number(5))))),
                        $.ForIn(a, c,
                            $.Block(
                                $.If($.Equals(a, $.String('ya')),
                                    $.Break(),
                                    $.Expression($.AddAssign(b, $.ComputedMember(c, a))))))))
                            
                    .testResult()
                        .type('number', '3')
                        
                    .test($.Expression(a))
                        .type('string', 'ya')
                        
                    .test($.Expression(b))
                        .type('number', '3')
            }],
        ]
    };
});
