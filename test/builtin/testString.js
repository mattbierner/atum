define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    var String = $.Id('String');
    
    return {
        'module': "Builtin String",
        'tests': [
            ["String(x) converts to string",
            function(){
                [[$.String('abc'), 'abc'],
                 [$.Number(10), '10'],
                 [$.Boolean(false), 'false'],
                 [$.Object(), '[object Object]']].forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Expression(
                                 $.Call(String, [x[0]]))))
                         
                         .testResult()
                             .type('string', x[1]);
                });
            }],
            ["new String() unboxes to empty string.",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Add($.New(String, []), $.String('abc')))))
                         
                    .testResult()
                        .type('string', 'abc');
            }],
            ["Set on String",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(String, [$.String('abc')]))),
                         $.Expression(
                             $.Assign($.Member(a, b), $.String('xyz')))))
                     
                     .test($.Expression($.Add(a, $.Member(a, b))))
                         .type('string', 'abcxyz');
            }],
            ["`String.prototype.valueOf`",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(String, [$.String('abc')]))),
                         $.Expression(
                             $.Assign(b, $.String('xyz')))))
                     
                     .test($.Expression($.Call($.Member(a, $.Id('valueOf')), [])))
                         .type('string','abc')
                     
                     .test(
                         $.Expression(
                             $.Call(
                                 $.Member($.Member($.Member(String, $.Id('prototype')), $.Id('valueOf')), $.Id('call')),
                                 [b])))
                         .type('string', 'xyz');
            }],
        ]
    };
});
