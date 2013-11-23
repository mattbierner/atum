define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');

    return {
        'module': "Function Tests",
        'tests': [
            ["Empty Func Declaration",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block())))
                    .test($.Expression($.Call(a, [])))
                        .type('undefined', undefined);
            }],
            ["Constant Func Declaration",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.Return($.Number(3))))))
                        
                    .test($.Expression($.Call(a, [])))
                        .type('number', 3);
            }],
            ["Id Func Declaration",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                                $.Return(b)))))
                                
                    .test($.Expression($.Call(a, [$.Number(3)])))
                        .type('number', 3);
            }],
            ["Multiple Argument Func Declaration",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b, c],
                            $.Block(
                                $.Return($.Div(b, c))))))
                    .test(
                        $.Expression($.Call(a, [
                           $.Number(6),
                           $.Number(2)])))
                       .type('number', 3);
            }],
            ["Undefined Argument",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                                $.Return(b)))))
                    
                   .test($.Expression($.Call(a, [])))
                       .type('undefined', undefined);
            }],
            ["Argument Scope Leak Check",
            function(){
                // Make sure bound arguments are not accessible in calling scope.
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block()),
                        $.Expression($.Call(a, [$.Number(1)])),
                        $.Expression(b)))
                        
                    .isError();
            }],
            
            ["Argument Alias Scope Check",
            function(){
                // Make sure closest bound value for argument is used.
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(b, $.Number(100))),
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                                $.Return(b)))))
                              
                    .test($.Expression($.Call(a, [$.Number(1)])))
                        .type('number', 1);
            }],
            ["Dynamic Resolution In Scope Check",
            function(){
                // Check that variables in function scope are resolved to current
                // values, not values when function declared.
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(b)),
                        $.FunctionDeclaration(a, [],
                            $.Block(
                              $.Return(b))),
                        $.Expression(
                            $.Assign(b, $.Number(1))),
                        $.Expression($.Add(
                            // b resolves to 1
                            $.Call(a, []), 
                            // b resolves to 3
                            $.Call(a, [
                                   $.Assign(b, $.Number(3))])))))
                                   
                   .testResult()
                       .type('number', 4);
            }],
            
            ["Closure Argument Check",
            function(){
                // Checks that argument passed in can be used in returned function.
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                              $.Return(
                                  $.FunctionExpression(null, [],
                                      $.Block(
                                          $.Return(b))))))))
                                          
                   .test($.Expression($.Call($.Call(a, [$.Number(1)]), [])))
                      .type('number', 1);
            }],
            ["Closure Variable Check",
            function(){
                // Checks that variable defines in function scope is accessible in closure.
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.Var(
                                    $.Declarator(b, $.Number(1))),
                              $.Return(
                                  $.FunctionExpression(null, [],
                                      $.Block(
                                          $.Return(b))))))))
                      
                    .test($.Expression($.Call($.Call(a, []), [])))
                        .type('number', 1);
            }],
            ["Declaration Aliases Arugment",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                                $.Var(
                                    $.Declarator(b)),
                                $.Return(b)))))
                    .test($.Expression($.Call(a, [$.Number(10)])))
                        .type('number', 10);
            }],
            ["External Assignment Check",
            function(){
                // Checks that variable assignment for external scope modifies
                // that variable.
                expect.run(
                    $.Program(
                        $.Expression(
                            $.Assign(b, $.Number(0))),
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Expression($.Assign(b, $.Number(10))))),
                        $.Expression($.Call(a, []))))
                    
                    .test($.Expression(b))
                        .type('number', 10);
            }],
            
             
            ["Values passed by value",
            function(){
                // Checks that arguments primitive values are passed by value
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(
                            a,
                            [b],
                            $.Block(
                               $.Expression($.Assign(b, $.Number(10))))),
                        $.Expression(
                            $.Assign(b, $.Number(2))),
                        $.Expression($.Call(a, [b]))))
                    
                    .test($.Expression(b))
                        .type('number', 2);
            }],
            
            ["Objects passed by reference",
            function(){
                // Checks that argument object values are passed by reference
                // but that environment binding still acts correctly.
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                               $.Expression($.Assign($.Member(b, c), $.Number(10))),
                               $.Expression($.Assign(b, $.Number(1))))),
                        $.Expression($.Assign(b, $.Object(
                            $.ObjectValue($.String('c'), $.Number(1))))),
                         $.Expression($.Call(a, [b]))))
                         
                    .test($.Expression($.Member(b, c)))
                        .type('number', 10);
            }],
            
            ["Call With global this",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                               $.Expression($.Assign($.Member($.This(), c), b)))),
                        $.Expression($.Call(a, [$.Number(10)]))))
                    
                    .test($.Expression($.Member($.This(), c)))
                        .type('number', 10);
            }],
            ["Set Property on function object",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Return($.Number(1)))),
                       $.Expression($.Assign($.Member(a, c), $.Number(10)))))
                     
                    .test(
                        $.Expression(
                            $.Add($.Call(a, []), $.Member(a, c))))
                        .type('number', 11);
            }],
            ["Set on current function object in function",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                               $.Expression($.Assign($.Member(a, c), b)),
                               $.Return($.Number(b)))),
                        $.Expression($.Call(a, [$.Number(11)]))))
                    
                    .test($.Expression($.Member(a, c)))
                        .type('number', 11);
            }],
            ["Throw in function",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                               $.Throw(b))),
                        $.Try(
                            $.Expression($.Call(a, [$.Number(11)])),
                        $.Catch(c,
                            $.Expression(c)))))
                        
                    .testResult()
                        .type('number', 11);
            }],
            ["Error in function",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                               $.Return(b))),
                        $.Try(
                            $.Expression($.Call(a, [])),
                        $.Catch(c,
                            $.Expression($.Number(13))))))
                        
                    .testResult()
                        .type('number', 13);
            }],
            ["Func Declaration Recursive Call",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                                $.If($.Gt(b, $.Number(1)),
                                    $.Return($.Call(a, [$.Sub(b, $.Number(1))]))),
                                $.Return(b)))))
                                
                    .test($.Expression($.Call(a, [$.Number(5)])))
                        .type('number', 1);
            }],
            ["Delete Func Declaration",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block(
                                $.Return($.Number(13)))),
                        $.Expression($.Assign(b, $.Call(a, []))),
                        $.Expression($.Assign(c, $.Delete(a))),
                        $.Expression($.Call(a, []))))
                    
                    .isError()
                    
                    .test($.Expression(b))
                        .type('number', 13)
                    
                    .test($.Expression(c))
                        .type('boolean', true);
            }],
            
            ["Language Function to string",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [],
                            $.Block())))
                    .test($.Expression($.Add(a, $.String('x'))))
                        .type('string');
            }],
            
            ["Exception in function restores old env",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                                $.If($.Gt(b, $.Number(10)),
                                    $.Throw($.Mul(b, $.Number(10)))),
                                $.Return(
                                    $.Call(a, [$.Add(b, $.Number(1))])))),
                        $.Try(
                            $.Block(
                                $.Expression($.Call(a, [$.Number(0)]))),
                            $.Catch(c,
                                $.Block())),
                        $.Expression(b)))
                        
                    .isError();
            }],
            
            /* This test takes to long to be regularly included
            ["Max Stack",
            function(){
                expect.run(
                    $.Program(
                        $.FunctionDeclaration(a, [b],
                            $.Block(
                               $.If($.Gt(b, $.Number(0)),
                                   $.Return($.Call(a, [$.Sub(b, $.Number(1))])),
                                   $.Return(b)))),
                        $.Expression($.Call(a, [$.Number(1001)]))))
                    .isError();
            }],*/
            
        ]
    };
});
