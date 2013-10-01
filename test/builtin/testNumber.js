define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    var Number = $.Id('Number');
    
    return {
        'module': "Builtin Number",
        'tests': [
            ["Number(x) converts to number",
            function(){
                [[$.Number(1), 1],
                [$.String("10"), 10],
                [$.Boolean(false), 0]].forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Expression(
                                 $.Call(Number, [x[0]]))))
                         
                         .testResult()
                             .type('number', x[1]);
                });
            }],
            ["new Number() unboxes to zero.",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Add($.New(Number, []), $.Number(100)))))
                         
                    .testResult()
                        .type('number', 100);
                
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Add($.New(Number, []), $.String('abc')))))
                             
                    .testResult()
                        .type('string', "0abc");
            }],
            ["Set on number",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(Number, []))),
                         $.Expression(
                             $.Assign($.Member(a, b), $.Number(10)))))
                     .test($.Expression($.Add(a, $.Member(a, b))))
                         .type('number', 10);
            }],
            ["`Number.prototype.valueOf`",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(Number, [$.Number(3)]))),
                         $.Expression(
                             $.Assign(b, $.Number(10)))))
                     
                     .test($.Expression($.Call($.Member(a, $.Id('valueOf')), [])))
                         .type('number', 3)
                     
                     .test(
                         $.Expression(
                             $.Call(
                                 $.Member($.Member($.Member(Number, $.Id('prototype')), $.Id('valueOf')), $.Id('call')),
                                 [b])))
                         .type('number', 10);
            }],
        ]
    };
});
