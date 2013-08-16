define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        Object = $.Id('Object'),
        Number = $.Id('Number'),
        defineProperty = $.Member(Object, $.Id('defineProperty')),
        create = $.Member(Object, $.Id('create'));

    return {
        'module': "Instanceof operator",
        'tests': [
            ["Simple Instanceof",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Object()))))
                 
                 .test($.Expression($.Instanceof(a, Object)))
                     .type('boolean', true)
                
                 .test($.Expression($.Instanceof(a, Number)))
                         .type('boolean', false);
            }],
            ["Inherited",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(a, $.Object())),
                        $.Expression(
                            $.Assign(b, $.Call(create, [a])))))
                 
                 .test($.Expression($.Instanceof(b, a)))
                     .type('boolean', true)
                
                 .test($.Expression($.Instanceof(b, Object)))
                         .type('boolean', true)
                
                 .test($.Expression($.Instanceof(b, a)))
                         .type('boolean', false);
            }],
        ]
    };
});
