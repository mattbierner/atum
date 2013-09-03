define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    return {
        'module': "Try",
        'tests': [
            ["nothrow try catch",
            function(){
                expect.run(
                    $.Program(
                        $.Try(
                            $.Block(
                                $.Expression($.Assign(b, $.Number(10)))),
                            $.Catch(a,
                                $.Block(
                                    $.Expression($.Assign(b, $.Number(20))))))))
                                    
                    .test($.Expression(b))
                        .type('number', 10);
            }],
            ["nothrow try catch yield",
            function(){
                expect.run(
                    $.Program(
                        $.Try(
                            $.Block(
                                $.Expression($.Number(10))),
                            $.Catch(a,
                                $.Block(
                                    $.Expression($.Number(20)))))))
                                    
                    .testResult()
                        .type('number', 10);
            }],
            ["throw try catch",
            function(){
                expect.run(
                    $.Program(
                        $.Assign(b, $.Number(0)),
                        $.Try(
                            $.Block(
                                $.Expression($.PostIncrement(b)),
                                $.Throw($.Number(10)),
                                $.Expression($.PostIncrement(b))),
                            $.Catch(a,
                                $.Block(
                                    $.Expression($.AddAssign(b, a)))))))
                                    
                    .test($.Expression(b))
                        .type('number', 11);
            }],
            ["throw try catch yield",
            function(){
                expect.run(
                    $.Program(
                        $.Try(
                            $.Block(
                                $.Expression($.Number(10)),
                                $.Throw($.Number(30))),
                            $.Catch(a,
                                $.Block(
                                    $.Expression($.Number(20)))))))
                                    
                    .testResult()
                        .type('number', 20);
            }],
            ["throw try catch, catch var used outside of catch block is error",
            function(){
                expect.run(
                    $.Program(
                        $.Try(
                            $.Block(
                                $.Throw($.Number(10))),
                            $.Catch(a,
                                $.Block())),
                    $.Expression(a)))
                    
                    .isError();
            }],
            ["throw try catch, catch var hides and does not mutate current binding",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(2))),
                        $.Try(
                            $.Block(
                                $.Throw($.Number(3))),
                            $.Catch(a,
                                $.Block(
                                    $.AddAssign(a, a))))))
                                    
                    .test($.Expression(a))
                        .type('number', 2);
            }],
            ["throw try catch, catch scope assign back to global",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Number(2))),
                        $.Try(
                            $.Block(
                                $.Throw($.Number(3))),
                            $.Catch(a,
                                $.Block(
                                    $.AddAssign($.Member($.This(), a), a))))))
                                    
                    .test($.Expression(a))
                        .type('number', 5);
            }],
            ["throw try empty catch yield from catch body",
            function(){
                expect.run(
                    $.Program(
                        $.Try(
                            $.Block(
                                $.Expression($.Number(10)),
                                $.Throw($.Number(100))),
                            $.Catch(a,
                                $.Block()))))
                                
                    .testResult()
                        .type('number', 10);
            }],
            ["throw try empty catch yield from pre",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Number(10)),
                        $.Try(
                            $.Block(
                                $.Throw($.Number(10))),
                            $.Catch(a,
                                $.Block()))))
                                
                    .testResult()
                        .type('number', 10);
            }],
            ["throw finally no catch",
            function(){
                expect.run(
                    $.Program(
                        $.Assign(b, $.Number(1)),
                        $.Try(
                            $.Block(
                                $.Try(
                                    $.Block(
                                        $.Expression($.PostIncrement(b)),
                                        $.Throw($.Number(10)),
                                        $.Expression($.PostIncrement(b))),
                                    null,
                                    $.Block(
                                        $.Expression($.Assign(b, $.Mul(b, b)))))),
                            $.Catch(a, $.Block()))))
                            
                    .test($.Expression(b))
                        .type('number', 4);
            }],
            ["Nothrow finally no catch",
            function(){
                expect.run(
                    $.Program(
                        $.Assign(b, $.Number(1)),
                        $.Try(
                            $.Block(
                                $.Try(
                                    $.Block(
                                        $.Expression($.PostIncrement(b))),
                                    null,
                                    $.Block(
                                        $.Expression($.Assign(b, $.Mul(b, b)))))),
                            $.Catch(a, $.Block()))))
                            
                    .test($.Expression(b))
                        .type('number', 4);
            }],
            ["Throw, catch also throws",
            function(){
                expect.run(
                    $.Program(
                        $.Try(
                            $.Block(
                                $.Try(
                                    $.Block(
                                        $.Throw($.Number(10))),
                                    $.Catch(a,
                                        $.Block(
                                            $.Throw(a))))),
                            $.Catch(a,
                                $.Block(
                                    $.Expression(a))))))
                                    
                    .testResult()
                        .type('number', 10);
            }],
            ["Throw, catch also throws",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(1))),
                        $.Try(
                            $.Block(
                                $.Try(
                                    $.Block(
                                        $.Expression($.Assign(b, $.Number(2))),
                                        $.Throw($.Number(b)),
                                        $.Expression($.Assign(b, $.Number(3)))),
                                    $.Catch(a,
                                        $.Block(
                                            $.Expression($.AddAssign(b, $.Number(8))),
                                            $.Throw(a),
                                            $.Expression($.AddAssign(b, $.Number(16))))))),
                            $.Catch(a,
                                $.Block(
                                    $.Expression(b))))))
                                    
                    .testResult()
                        .type('number', 10);
            }],
            ["Throw, catch also throws with finally",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(b, $.Number(1))),
                        $.Try(
                            $.Block(
                                $.Try(
                                    $.Block(
                                        $.Expression($.Assign(b, $.Number(2))),
                                        $.Throw(b),
                                        $.Expression($.Assign(b, $.Number(3)))),
                                    $.Catch(a,
                                        $.Block(
                                            $.Expression($.AddAssign(b, $.Number(8))),
                                            $.Throw(a),
                                            $.Expression($.AddAssign(b, $.Number(16))))),
                                    $.Block(
                                        $.Expression($.AddAssign(b, $.Number(100)))))),
                            $.Catch(a,
                                $.Block(
                                    $.Expression($.AddAssign(b, a)))))))
                                    
                        .test($.Expression(b))
                            .type('number', 112);
            }],
            ["Throw, catch return and finally return",
            function(){
               expect.run(
                   $.Program(
                        $.FunctionDeclaration(a, [], $.Block(
                            $.Try(
                                $.Block(
                                    $.Return(b)),
                                $.Catch(b,
                                    $.Block(
                                        $.Return($.Number(1)))),
                                $.Block(
                                    $.Return($.Number(2))))))))
                                    
                    .test($.Expression($.Call(a, [])))
                        .type('number', 2);
            }],
             ["State Try throw, catch, finally",
            function(){
                expect.run(
                    $.Program(
                        $.Assign(a, $.Number(1)),
                        $.Try(
                            $.Block(
                                $.Expression($.PostIncrement(a)),
                                $.Throw($.Number(1)),
                                $.Expression($.PostIncrement(a))),
                            $.Catch(b,
                                $.Block()),
                            $.Block(
                                $.Expression(a)))))
                        
                        .testResult()
                            .type('number', 2);
            }],
        ]
    };
});
