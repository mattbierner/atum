define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    return {
        'module': "If Statement",
        'tests': [
            ["Simple If True Statement",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a)),
                        $.If(
                            $.Boolean(true),
                            $.Expression(
                                $.Assign(a, $.Number(1))))))
                    
                    .test($.Expression(a))
                        .type('number', 1);
            }],
            ["Simple If True Statement yielded",
            function(){
                expect.run(
                    $.Program(
                        $.If(
                            $.Boolean(true),
                            $.Expression($.Number(1)))))
                            
                    .testResult()
                        .type('number', 1);
            }],
            ["Simple If false Statement",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a)),
                        $.If(
                            $.Boolean(false),
                            $.Expression(
                                $.Assign(a, $.Number(1))))))
                    
                    .test($.Expression(a))
                        .type('undefined', undefined);
            }],
            ["Simple If false Statement yielded",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Number(5)),
                        $.If(
                            $.Boolean(false),
                            $.Expression($.Number(1)))))
                    
                    .testResult()
                        .type('number', 5);
            }],
            ["Simple If True Else Statement",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a)),
                        $.If(
                            $.Boolean(true),
                            $.Expression(
                                $.Assign(a, $.Number(1))),
                            $.Expression(
                                $.Assign(a, $.Number(10))))))
                    
                    .test($.Expression(a))
                        .type('number', 1);
            }],
            ["Simple If False Else Statement",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a)),
                        $.If(
                            $.Boolean(false),
                            $.Expression(
                                $.Assign(a, $.Number(1))),
                            $.Expression(
                                $.Assign(a, $.Number(10))))))
                                
                    .test($.Expression(a))
                        .type('number', 10);
            }],
            ["True Test Side Effects",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a, $.Number(0))),
                        $.If(
                            $.PreIncrement(a),
                            $.Expression(
                                $.AddAssign(a, $.Number(1))),
                            $.Expression(
                                $.AddAssign(a, $.Number(10))))))
                            
                    .test($.Expression(a))
                        .type('number', 2);
            }],
            ["False Test Side Effects",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a, $.Number(0))),
                        $.If(
                            $.PostIncrement(a),
                            $.Expression(
                                $.AddAssign(a, $.Number(1))),
                            $.Expression(
                                $.AddAssign(a, $.Number(10))))))
                                
                    .test($.Expression(a))
                        .type('number', 11);
            }],
            
            ["Expression throws",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [], $.Block($.Throw($.Null()))),
                        $.Try(
                            $.If($.LogicalAnd($.Call(a, []), $.Assign(b, $.Number(3))),
                                $.Block(
                                    $.Expression(
                                        $.AddAssign(b, $.Number(1)))),
                                $.Block(
                                    $.Expression(
                                        $.AddAssign(b, $.Number(10))))),
                            $.Catch($.Id('e'), $.Block()))))
                                
                    .test($.Expression(b))
                        .type(undefined, undefined);
            }],
             
            ["Expression taken consequent throws",
            function(){
                expect.run(
                    $.Program(
                        $.Try(
                            $.If($.Assign(b, $.Number(3)),
                                $.Block(
                                    $.Expression(
                                        $.AddAssign(b, $.Number(1))),
                                    $.Throw($.String('c')),
                                    $.Expression(
                                        $.DivAssign(b, $.Number(2)))),
                                $.Block(
                                    $.Throw($.String('a')),
                                    $.Expression(
                                        $.AddAssign(b, $.Number(10))))),
                            $.Catch($.Id('e'),
                                $.Block(
                                    $.Expression($.Id('e')))))))
                    
                    .testResult()
                        .type('string', 'c')
                    
                    .test($.Expression(b))
                        .type('number', 4);
            }],
            
        ]
    };
});
