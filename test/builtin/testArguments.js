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
            ["Length",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.Return(
                                        $.Member(args, $.Id('length')))))))
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(5)])))
                    .type('number', 2)
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(5), $.Number(11), $.Number(42)])))
                    .type('number', 4)
                    
                .test(
                    $.Expression(
                        $.Call(a, [])))
                    .type('number', 0)
                    
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Id('undefined'), $.Number(5)])))
                    .type('number', 3)
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
            ["Strict Set parameter does not change arguments",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Expression($.String('use strict')),
                                $.Expression($.AddAssign(b, $.Number(2))),
                                $.Expression($.AddAssign(c, $.Number(4))),
                                $.Return(
                                    $.Div(
                                        $.ComputedMember(args, $.Number(0)),
                                        $.ComputedMember(args, $.Number(1))))))))
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(2)])))
                    .type('number', 5);
            }],
            ["Non Strict Set Argument changes parameter value",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Expression($.AddAssign($.ComputedMember(args, $.Number(0)), $.Number(2))),
                                $.Expression($.AddAssign($.ComputedMember(args, $.Number(1)), $.Number(4))),
                                $.Return(
                                    $.Div(b, c))))))
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(2)])))
                    .type('number', 2)
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(2), $.Number(11), $.Number(42)])))
                    .type('number', 2);
            }],
            ["Strict Set Argument does not parameter value",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Expression($.String('use strict')),
                                $.Expression($.AddAssign($.ComputedMember(args, $.Number(0)), $.Number(2))),
                                $.Expression($.AddAssign($.ComputedMember(args, $.Number(1)), $.Number(4))),
                                $.Return(
                                    $.Div(b, c))))))
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(2)])))
                    .type('number', 5)
                
                .test(
                    $.Expression(
                        $.Call(a, [$.Number(10), $.Number(2), $.Number(11), $.Number(42)])))
                    .type('number', 5);
            }],
            
            ["Non Strict Callee",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Return($.Member(args, $.Id('callee')))))))
                
                .test(
                    $.Expression(
                        $.StrictEquals(
                            a,
                            $.Call(a, []))))
                    .type('boolean', true)
            }],
            ["Strict Callee throws",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.Expression($.String('use strict')),
                                $.Try(
                                    $.Block(
                                        $.Expression($.Member(args, $.Id('callee'))),
                                        $.Return($.Boolean(false))),
                                    $.Catch($.Id('e'),
                                        $.Block(
                                            $.Return($.Boolean(true)))))))))
                
                .test(
                    $.Expression(
                            $.Call(a, [])))
                    .type('boolean', true)
            }],
        ]
    };
});
