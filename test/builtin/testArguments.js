define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        d = $.Id('d'),
        args = $.Id('arguments'),
        bind = $.Id('bind'),
        call = $.Id('call'),
        apply = $.Id('apply');
    
    return {
        'module': "Arguments",
        'tests': [
            ["Index Access",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Return(
                                    $.Div(
                                        $.ComputedMember(args, $.Number(0)),
                                        $.ComputedMember(args, $.Number(1))))))))
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(5)])))
                    .type('number', 2)
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(5), $.Number(11), $.Number(42)])))
                    .type('number', 2)
                    
                .test(
                    $.Expression(
                        $.Call($.Id('isNaN'), [$.Call(a, [$.Number(10)])])))
                    .type('boolean', true);
            }],
            ["Non Strict Set parameter value changes arguments",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Expression($.AddAssign(b, $.Number(2))),
                                $.Expression($.AddAssign(c, $.Number(4))),
                                $.Return(
                                    $.Div(
                                        $.ComputedMember(args, $.Number(0)),
                                        $.ComputedMember(args, $.Number(1))))))))
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(2)])))
                    .type('number', 2)
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(2), $.Number(11), $.Number(42)])))
                    .type('number', 2);
            }],
        ]
    };
});
