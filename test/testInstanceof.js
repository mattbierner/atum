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
                        $.FunctionDeclaration(a, [], $.Block()),
                        $.FunctionDeclaration(b, [], $.Block()),
                        $.Expression(
                            $.Assign($.Member(b, $.Id('prototype')), $.New(a, []))),
                        $.Expression(
                            $.Assign(c,
                                $.New(b, [])))))
                 
                 .test($.Expression($.Instanceof(b, a)))
                     .type('boolean', false)
                
                 .test($.Expression($.Instanceof(c, Object)))
                         .type('boolean', true)
                
                 .test($.Expression($.Instanceof(c, a)))
                         .type('boolean', true)
                 
                 .test($.Expression($.Instanceof(c, b)))
                         .type('boolean', true);
            }],
            ["Builtin",
            function(){
                expect.run(
                    $.Program())
                 
                 .test($.Expression($.Instanceof(Number, Number)))
                     .type('boolean', false)
                
                 .test($.Expression($.Instanceof($.Number(5), Number)))
                     .type('boolean', false)
                
                 .test($.Expression($.Instanceof($.New(Number, []), Number)))
                     .type('boolean', true);
            }],
        ]
    };
});
