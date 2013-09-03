define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    return {
        'module': "Conditional Tests",
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
            ["If Statement True Test Side Effects",
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
            ["If Statement False Test Side Effects",
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
            
        ]
    };
});
