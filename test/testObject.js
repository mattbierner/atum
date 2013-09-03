define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        d = $.Id('d');

    return {
        'module': "Object",
        'tests': [
            ["Simple Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, 
                            $.Object({
                                 'kind': 'init',
                                 'key': $.String('ab'),
                                 'value': $.Number(1)
                             })))))
                             
                    .test($.Expression($.Member(a, $.Id('ab'))))
                        .type('number', 1)
                        
                    .test($.Expression($.ComputedMember(a, $.Add($.String('a'), $.String('b')))))
                        .type('number', 1);
            }],
            ["Non Member Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a, $.Object()))))
                    
                    .test($.Expression($.Member(a, b)))
                        .type('undefined', undefined);
            }],
            ["Multiple Properties Member Object Literal",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object({
                                     'kind': 'init',
                                     'key': $.String('b'),
                                     'value': $.Number(1)
                                 }, {
                                     'kind': 'init',
                                     'key': $.String('c'),
                                     'value': $.Number(2)
                                 })))))
                     
                    .test($.Expression(
                        $.Add(
                            $.Member(a, b),
                            $.Member(a, c))))
                        .type('number', 3);
            }],
            ["Multiple Duplicate Property Member Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object({
                                     'kind': 'init',
                                     'key': $.String('b'),
                                     'value': $.Number(1)
                                 }, {
                                     'kind': 'init',
                                     'key': $.String('b'),
                                     'value': $.Number(2)
                                 })))))
                                 
                    .test($.Expression($.Member(a, b)))
                        .type('number', 2);
            }],
            ["Getter Property Member Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object({
                                     'kind': 'get',
                                     'key': $.String('b'),
                                     'value': $.FunctionExpression(null, [],
                                         $.Block(
                                            $.Return($.Number(1))))
                                 })))))
                    
                     .test($.Expression($.Member(a, b)))
                         .type('number', 1);
            }],
            ["Getter This Property Member Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object({
                                     'kind': 'init',
                                     'key': $.String('c'),
                                     'value': $.Number(1)
                                 }, {
                                     'kind': 'get',
                                     'key': $.String('b'),
                                     'value': $.FunctionExpression(null, [],
                                         $.Block(
                                            $.Return(
                                                $.Member($.This(), c))))
                                 })))))
                                 
                    .test($.Expression($.Member(a, b)))
                        .type('number', 1);
            }],
            
            ["Objects passed by reference",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object({
                                     'kind': 'init',
                                     'key': $.String('c'),
                                     'value': $.Number(1)
                                 })),
                                 $.Declarator(b, a)),
                         $.Expression(
                             $.Assign(
                                 $.Member(a, c),
                                 $.Number(2)))))
                                 
                    .test($.Expression($.Member(b, c)))
                        .type('number', 2);
            }],
            
            ["setter yields set value",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, $.Object({
                            'kind': 'set',
                            'key': $.String('b'),
                            'value': $.FunctionExpression(null, [c],
                                 $.Block(
                                    $.Expression($.Assign($.Member($.This(), d), $.Number(23))),
                                    $.Return($.Number(13))))
                        })))))

                    .test($.Expression(
                        $.Add(
                            $.Assign($.Member(a, b), $.Number(100)),
                            $.Member(a, d))))
                        .type('number', 123);
            }],
            
            ["Delete property",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object({
                                     'kind': 'init',
                                     'key': $.String('b'),
                                     'value': $.Number(1)
                                 }))),
                         $.Expression(
                             $.Delete($.Member(a, b)))))
                     
                     .testResult()
                         .type('boolean', true)
                         
                     .test($.Expression($.Member(a, b)))
                         .type('undefined', undefined);
            }],
            ["Delete undefined property",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object())),
                         $.Expression(
                             $.Delete($.Member(a, b)))))
                             
                      .testResult()
                         .type('boolean', true)
                     
                     .test($.Expression($.Member(a, b)))
                         .type('undefined', undefined);
            }],
        ]
    };
});
