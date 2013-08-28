define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        d = $.Id('d'),
        Object = $.Id('Object'),
        call = $.Id('call'),
        apply = $.Id('apply'),
        prototype = $.Id('prototype'),
        toString = $.Id('toString')
        Object_prototype_toString = $.Member($.Member(Object, prototype), toString);
    
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
                            $.Call($.Member(a, call), [$.Number(2)]))))
                    .type('number', 2)
                
                .test(
                    $.Expression($.Sequence(
                        $.Call($.Member(a, call), [$.Number(2), $.Number(3), $.Number(2)]),
                        d)))
                    .type('number', 5);
            }],
            ["function.prototype.call on builtin function",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                Object_prototype_toString))))
                .test(
                    $.Expression(
                        $.Call($.Member(a, $.Id('call')), [$.Number(2)])))
                    .type('string', '[object Number]');
            }],
            ["function.prototype.call with global this",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                                $.Return($.Assign($.Member($.This(), c), b))))))
                
                .test(
                    $.Expression($.Sequence(
                        $.Call($.Member(a, call), [$.This(), $.Number(2)]),
                        c)))
                    .type('number', 2);
            }],
            
            ["function.prototype.apply on language function",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.If($.StrictEquals(c, $.Id('undefined')),
                                    $.Return($.Number(-1))),
                                $.Return($.Add(b, c))))))
                
                .test(
                    $.Expression(
                        $.Call($.Member(a, apply), [$.Null(), $.Array($.Number(2), $.Number(5))])))
                    .type('number', 7)
                
                .test(
                    $.Expression(
                        $.Call($.Member(a, apply), [$.Null(), $.Array($.Number(2))])))
                    .type('number', -1);
            }],
        ]
    };
});
