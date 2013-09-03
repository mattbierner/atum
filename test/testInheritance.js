define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        w = $.Id('w'),
        x = $.Id('x'),
        y = $.Id('y'),
        z = $.Id('z');

    return {
        'module': "Inheritance",
        'tests': [
            ["Simple new constructor",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(10))),
                               $.Return($.Number(1))))))
                               
                    .test($.Expression($.Member($.New(a, []), x)))
                        .type('number', 10);
            }],
            ["Simple new constructor, this overrides prototype",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.AddAssign($.Member($.This(), x), $.Number(10))),
                               $.Return($.Number(1)))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20)))))
                        
                    .test($.Expression($.Member($.New(a, []), x)))
                        .type('number', 30);
            }],
            ["Simple new constructor return object",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(10))),
                               $.Return($.Object({'key': $.String('z'), 'kind': 'init', 'value': $.Number(20)}))))))
                               
                    .test($.Expression($.Member($.New(a, []), $.Id('z'))))
                        .type('number', 20);
            }],
            ["Simple new inherit",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(10))))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), y), $.Number(20))),
                        $.FunctionDeclaration(b, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), z), $.Number(30))))),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, [])))))
                        
                    .test($.Expression($.Member($.New(b, []), x)))
                        .type('number', 10)
                
                    .test($.Expression($.Member($.New(b, []), y)))
                        .type('number', 20)
                
                    .test($.Expression($.Member($.New(b, []), z)))
                        .type('number', 30);
            }],
            ["Simple new inherit, override from this",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(10))))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), y), $.Number(20))),
                        $.FunctionDeclaration(b, [],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), x), $.Number(30))))),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, [])))))
                        
                  .test($.Expression($.Member($.New(b, []), x)))
                      .type('number', 30);
            }],
            ["Changing dervided prototype does not effect base",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block()),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(10))),
                        $.FunctionDeclaration(b, [],
                            $.Block()),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, []))),
                        $.Expression($.Assign($.Member($.Member(b, $.Id('prototype')), x), $.Number(20)))))
                        
                    .test($.Expression($.Add($.Member($.New(b, []), x), $.Member($.New(a, []), x))))
                        .type('number', 30);
            }],
            ["Changing base prototype after does effect base",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block()),
                        $.FunctionDeclaration(b, [],
                            $.Block()),
                        $.Expression($.Assign($.Member(b, $.Id('prototype')), $.New(a, []))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20)))))
                        
                    .test($.Expression($.Add($.Member($.New(b, []), x), $.Member($.New(a, []), x))))
                        .type('number', 40);
            }],
            ["Changing prototype after creation effects instance",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block()),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(10))),
                        $.Expression($.Assign(b, $.New(a, []))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20)))))
                    
                    .test($.Expression($.Member(b, x)))
                        .type('number', 20);
            }],
            ["Changing prototype after creation on mutated object does not effect",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block()),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(10))),
                        $.Expression($.Assign(b, $.New(a, []))),
                        $.Expression($.Assign($.Member(b, x), $.Number(300))),
                        $.Expression($.Assign($.Member($.Member(a, $.Id('prototype')), x), $.Number(20)))))
                    
                    .test($.Expression($.Member(b, x)))
                        .type('number', 300);
            }],
        ]
    };
});
