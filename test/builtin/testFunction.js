define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        d = $.Id('d'),
        Object = $.Id('Object'),
        bind = $.Id('bind'),
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
            
        // Apply
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
            
        // Bind
            ["function.prototype.bind args",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c, d],
                            $.Block(
                                $.Return($.Div($.Add(b, c), d)))),
                        $.Expression($.Assign(b, $.Call($.Member(a, bind), [$.Null(), $.Number(1), $.Number(3)])))))
                
                .test(
                    $.Expression(
                        $.Call(b, [$.Number(2)])))
                    .type('number', 2);
            }],
            ["function.prototype.bind this",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.Return($.Member($.This(), c)))),
                        $.Expression(
                            $.Assign(b,
                                $.Call(
                                    $.Member(a, bind),
                                    [$.Object({
                                        'kind': 'init',
                                        'key': $.String('c'),
                                        'value': $.Number(4)
                                    })])))))
                
                .test(
                    $.Expression(
                        $.Call(b, [])))
                    .type('number', 4);
            }],
            ["function.prototype.bind non object this",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.Return($.Member($.This(), $.Id('toString'))))),
                        $.Expression(
                            $.Assign(b,
                                $.Call(
                                    $.Member(a, bind),
                                    [$.Number(1)])))))
                
                .test(
                    $.Expression(
                        $.Equals(
                            $.Call(b, []),
                            $.Member($.Member($.Id('Number'), prototype), $.Id('toString')))))
                    .type('boolean', true);
            }],
            ["function.prototype.bind construct",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Expression($.Assign($.Member($.This(), c), $.Add(b, c))))),
                        $.Expression(
                            $.Assign(b,
                                $.Call(
                                    $.Member(a, bind),
                                    [$.Null(), $.Number(4)])))))
                
                .test(
                    $.Expression(
                        $.Member($.New(b, [$.Number(3)]), c)))
                    .type('number', 7);
            }],
             ["function.prototype.bind multi bind args",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c, d],
                            $.Block(
                                $.Return($.Div($.Mul($.Add(b, c), d), $.ComputedMember($.This(), $.String('x')))))),
                        $.Expression(
                            $.Assign(b,
                                $.Call(
                                    $.Member(a, bind),
                                    [$.Object({
                                        'kind': 'init',
                                        'key': $.String('x'),
                                        'value': $.Number(2)
                                    }), $.Number(6)]))),
                        $.Expression(
                            $.Assign(c,
                                $.Call(
                                    $.Member(b, bind),
                                    [$.Null(), $.Number(4)])))))
                
                .test(
                    $.Expression(
                        $.Call(c, [$.Number(1)])))
                    .type('number', 5);
            }],
        ]
    };
});
