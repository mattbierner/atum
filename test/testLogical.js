define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');
    
    return {
        'module': "Logical Expressions",
        'tests': [
        // Logical And
            ["Logical And short",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(0)),
                             $.Declarator(b, $.Number(10))),
                        $.Expression( 
                            $.LogicalAnd($.PostIncrement(a), $.PostIncrement(b)))))
                    .testResult()
                        .type('number', 0)
                    .test($.Expression(a))
                        .type('number', 1);
            }],
            ["Logical And no short",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(0)),
                             $.Declarator(b, $.Number(10))),
                        $.Expression( 
                            $.LogicalAnd($.PreIncrement(a), $.PostIncrement(b)))))
                    .testResult()
                        .type('number', 10);
            }],
            // Logical Or
            ["Logical Or short",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(0)),
                             $.Declarator(b, $.Number(10))),
                        $.Expression( 
                            $.LogicalOr($.PostIncrement(a), $.PostIncrement(b)))))
                    .testResult()
                        .type('number', 10)
                    .test($.Expression(a))
                        .type('number', 1)
                    .test($.Expression(b))
                        .type('number', 11);
            }],
            ["Logical Or no short",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(0)),
                             $.Declarator(b, $.Number(10))),
                        $.Expression( 
                            $.LogicalOr($.PreIncrement(a), $.PostIncrement(b)))))
                    .testResult()
                        .type('number', 1)
                    .test($.Expression(a))
                        .type('number', 1)
                    .test($.Expression(b))
                        .type('number', 10);
            }],
        ],
    };
});
