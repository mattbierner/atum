define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    return {
        'module': "With",
        'tests': [
            ["Simple With",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, 
                            $.Object({
                                 'kind': 'init',
                                 'key': $.String('b'),
                                 'value': $.Number(1)
                             }))),
                         $.With(a, $.Block(
                             $.Expression(b)))))
                     
                    .testResult()
                        .type('number', 1);
            }],
            ["Delete ",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, 
                            $.Object({
                                 'kind': 'init',
                                 'key': $.String('b'),
                                 'value': $.Number(1)
                             }))),
                         $.With(a, $.Block(
                             $.Expression($.Delete(b))))))
                     
                    .testResult()
                        .type('boolean', true)
                    
                    .test($.Expression($.Member(a, b)))
                        .type('undefined', undefined);
            }],
        ]
    };
});
