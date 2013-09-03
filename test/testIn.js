define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        Object = $.Id('Object'),
        defineProperty = $.Member(Object, $.Id('defineProperty'));

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
            
            ["In non enumerable",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Call(defineProperty, [
                                $.Object(),
                                $.String('b'),
                                $.Object({
                                    'kind': 'init',
                                    'key': $.String('value'),
                                    'value': $.Number(10)
                                }, {
                                    'kind': 'init',
                                    'key': $.String('enumerable'),
                                    'value': $.Boolean(false)
                                })])))))
                 
                 .test($.Expression($.In($.String('b'), a)))
                     .type('boolean', true);
            }],
            ["In undefined",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Call(defineProperty, [
                                $.Object(),
                                $.String('b'),
                                $.Object()])))))
                 
                 .test($.Expression($.In($.String('b'), a)))
                     .type('boolean', true);
            }],
        ]
    };
});
