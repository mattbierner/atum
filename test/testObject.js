define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c'),
        d = $.Id('d'),
        create = $.Member($.Id('Object'), $.Id('create'));

    return {
        'module': "Object",
        'tests': [
            ["Simple Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Assign(a, 
                            $.Object(
                                $.ObjectValue($.String('ab'), $.Number(1)))))))
                             
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
                                $.Object(
                                     $.ObjectValue($.String('b'), $.Number(1)),
                                         $.ObjectValue($.String('c'), $.Number(2)))))))
                     
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
                                $.Object(
                                     $.ObjectValue($.String('b'), $.Number(1)),
                                     $.ObjectValue($.String('b'), $.Number(2)))))))
                     .isError();
            }],
            ["Getter Property Member Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object(
                                    $.ObjectGetter($.String('b'),
                                        $.FunctionExpression(null, [],
                                            $.Block(
                                                $.Return($.Number(1))))))))))
                    
                     .test($.Expression($.Member(a, b)))
                         .type('number', 1);
            }],
            ["Getter This Property Member Object Expression",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object(
                                     $.ObjectValue($.String('c'), $.Number(1)),
                                     $.ObjectGetter($.String('b'),
                                         $.FunctionExpression(null, [],
                                             $.Block(
                                                $.Return(
                                                    $.Member($.This(), c))))))))))
                                                    
                    .test($.Expression($.Member(a, b)))
                        .type('number', 1);
            }],
            ["Set value for Getter only Property",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object(
                                    $.ObjectValue($.String('c'), $.Number(1)),
                                    $.ObjectGetter($.String('b'),
                                         $.FunctionExpression(null, [],
                                             $.Block(
                                                $.Return(
                                                    $.Member($.This(), c)))))))),
                         $.Expression(
                             $.Assign(
                                 $.Member(a, b),
                                 $.Number(100)))))
                                 
                    .test($.Expression($.Member(a, b)))
                        .type('number', 1);
            }],
            
            ["Objects passed by reference",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Object(
                                    $.ObjectValue($.String('c'), $.Number(1)))),
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
                        $.Expression($.Assign(a, $.Object(
                            $.ObjectSetter($.String('b'),
                                $.FunctionExpression(null, [c],
                                     $.Block(
                                        $.Expression($.Assign($.Member($.This(), d), $.Number(23))),
                                        $.Return($.Number(13))))))))))

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
                                $.Object(
                                    $.ObjectValue($.String('b'), $.Number(1))))),
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
            ["Delete non configurable property in non strict",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Call(create, [
                                    $.Null(),
                                    $.Object(
                                        $.ObjectValue($.String('x'), $.Object(
                                            $.ObjectValue($.String('value'), $.Number(3)),
                                            $.ObjectValue($.String('configurable'), $.Boolean(false)))))
                                        ]))),
                        $.Expression(
                            $.Delete(
                                $.Member(a, $.Id('x'))))))
                      
                      .testResult()
                          .type('boolean', false)
                          
                      .test($.Expression($.Member(a, $.Id('x'))))
                         .type('number', 3);
            }],
            ["Delete non configurable property in strict",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.String('use strict')),
                        $.Var(
                            $.Declarator(a,
                                $.Call(create, [
                                    $.Null(),
                                    $.Object(
                                        $.ObjectValue($.String('x'), $.Object(
                                            $.ObjectValue($.String('value'), $.Number(3)),
                                            $.ObjectValue($.String('configurable'),$.Boolean(false)))))
                                        ]))),
                        $.Expression(
                            $.Delete(
                                $.Member(a, $.Id('x'))))))
                                
                      .isError()
                      
                      .test($.Expression($.Member(a, $.Id('x'))))
                         .type('number', 3);
            }],
            
            ["Access member on literal",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Number(1)))))
                             
                      .test(
                          $.Expression(
                              $.Equals(
                                  $.Member(a, $.Id('toString')),
                                  $.Member($.Member($.Id('Number'), $.Id('prototype')), $.Id('toString')))))
                         .type('boolean', true);
            }],
            
            ["Setting non writable property in non strict",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                            $.Declarator(a,
                                $.Call(create, [
                                    $.Null(),
                                    $.Object(
                                        $.ObjectValue($.String('x'), $.Object(
                                            $.ObjectValue($.String('value'), $.Number(3)),
                                            $.ObjectValue($.String('writable'), $.Boolean(false)))))
                                        ]))),
                        $.Expression(
                            $.Assign(
                                $.Member(a, $.Id('x')),
                                $.Number(100)))))
                      
                      .testResult()
                          .type('number', 100)
                          
                      .test($.Expression($.Member(a, $.Id('x'))))
                         .type('number', 3);
            }],
            ["Setting non writable property in strict errors",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.String('use strict')),
                        $.Var(
                            $.Declarator(a,
                                $.Call(create, [
                                    $.Null(),
                                    $.Object(
                                        $.ObjectValue($.String('x'), $.Object(
                                            $.ObjectValue($.String('value'), $.Number(3)),
                                            $.ObjectValue($.String('writable'), $.Boolean(false)))))
                                        ]))),
                        $.Expression(
                            $.Assign(
                                $.Member(a, $.Id('x')),
                                $.Number(100)))))
                      
                      .isError()
                      
                          
                      .test($.Expression($.Member(a, $.Id('x'))))
                         .type('number', 3);
            }],
        ]
    };
});
