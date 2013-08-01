define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        length = $.Id('length');

    return {
        'module': "Array",
        'tests': [
            ["Simple Literal",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a,
                             $.Array($.Number(0), $.Number(1), $.Number(2))))))
                    .test($.Expression($.Member(a, length)))
                        .type('number', 3)
                    .test($.Expression($.ComputedMember(a, $.Number(0))))
                        .type('number', 0);
            }],

        ]
    };
});
