define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    var Boolean = $.Id('Boolean');
    
    return {
        'module': "Builtin Boolean",
        'tests': [
            ["Boolean(x) converts to boolean",
            function(){
                [[$.Boolean(true), true],
                 [$.String(""), false],
                 [$.String('abc'), true],
                 [$.Object(), true]].forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Expression(
                                 $.Call(Boolean, [x[0]]))))
                         
                         .testResult()
                             .type('boolean', x[1]);
                });
            }],
            ["new Boolean() unboxes to false.",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Add($.New(Boolean, []), $.String('')))))
                         
                    .testResult()
                        .type('string', 'false');
            }],
            ["Set on Boolean",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(Boolean, []))),
                         $.Expression(
                             $.Assign($.Member(a, b), $.String('abc')))))
                         
                     .test($.Expression($.Add(a, $.Member(a, b))))
                         .type('string', 'falseabc');
            }],
            ["`Boolean.prototype.valueOf`",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(Boolean, [$.Boolean(true)]))),
                         $.Expression(
                             $.Assign(b, $.Boolean(true)))))
                     
                     .test($.Expression($.Call($.Member(a, $.Id('valueOf')), [])))
                         .type('boolean', true)
                     
                     .test(
                         $.Expression(
                             $.Call(
                                 $.Member($.Member($.Member(Boolean, $.Id('prototype')), $.Id('valueOf')), $.Id('call')),
                                 [b])))
                         .type('boolean', true);
            }],
        ]
    };
});
