define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    return {
        'module': "In operator",
        'tests': [
            ["Simple In ",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Object({
                                 'kind': 'init',
                                 'key': $.String('b'),
                                 'value': $.Number(1)
                             })))))
                 
                 .test($.Expression($.In($.String('b'), a)))
                     .type('boolean', true)
                
                 .test($.Expression($.In($.String('c'), a)))
                         .type('boolean', false);
            }],
            ["In expression lhs type conversion",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Array(
                                $.Number(14),
                                $.Number(16))))))
                 
                 .test($.Expression($.In($.Number(1), a)))
                     .type('boolean', true)
                
                 .test($.Expression($.In($.Add($.Number(0), $.Number(1)), a)))
                     .type('boolean', true)
                 
                 .test($.Expression($.In($.Add($.Number(5), $.Number(1)), a)))
                     .type('boolean', false);
            }],
            ["In inherited",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Object()))))
                 
                 .test($.Expression($.In($.String('toString'), a)))
                     .type('boolean', true);
            }],

        ]
    };
});
