define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        d = $.Id('d');
    
    var Function = $.Id('Function');
    
    return {
        'module': "Builtin Function",
        'tests': [
            ["function.prototype.call on language function",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Expression($.Assign(d, $.Add(b, c))),
                                $.Return($.This())))))
                .test(
                    $.Expression(
                        $.Add(
                            $.Number(0),
                            $.Call($.Member(a, $.Id('call')), [$.Number(2)]))))
                    .type('number', 2)
                .test(
                    $.Expression($.Sequence(
                        $.Call($.Member(a, $.Id('call')), [$.Number(2), $.Number(3), $.Number(2)]),
                        d)))
                    .type('number', 5);
            }],
            ["function.prototype.call on builtin function",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Member($.Member($.Id('Object'), $.Id('prototype')), $.Id('toString'))))))
                .test(
                    $.Expression(
                        $.Call($.Member(a, $.Id('call')), [$.Number(2)])))
                    .type('string', '[object Number]');
            }],
        ]
    };
});
