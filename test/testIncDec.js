define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a');
    
    var set = [
       $.Number(0),
       $.Number(10),
       $.Number(-10),
       $.Number(1.5),
       $.String("1")];
    
    return {
        'module': "Increment and Decrement Operators",
        'tests': [
        // Prefix Increment 
            ["Prefix Increment Changes Value",
            function(){
                set.forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression( 
                                $.PreIncrement(a))))
                                
                        .test($.Expression(a))
                            .type('number', +x.value + 1);
                });
            }],
            ["Prefix Increment Return Value",
            function(){
                set.forEach(function(x){
                   expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression( 
                                $.PreIncrement(a))))
                                
                        .testResult()
                            .type('number', +x.value + 1);
                });
            }],
            
        // Prefix Decrement 
            ["Prefix Decrement Changes Value",
            function(){
                set.forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression( 
                                $.PreDecrement(a))))
                        .test($.Expression(a))
                            .type('number', +x.value - 1);
                });
            }],
            ["Prefix Decrement Return Value",
            function(){
                set.forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression( 
                                $.PreDecrement(a))))
                                
                        .testResult()
                            .type('number', +x.value - 1);
                });
            }],
            
         // Postfix Increment 
            ["Postfix Increment Changes Value",
            function(){
                set.forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression( 
                                $.PostIncrement(a))))
                        
                        .test($.Expression(a))
                            .type('number', +x.value + 1);
                });
            }],
            ["Postfix Increment Return Value",
            function(){
                set.forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression( 
                                $.PostIncrement(a))))
                                
                        .testResult()
                            .type('number', +x.value);
                });
            }],
            
        // Postfix Decrement 
            ["Postfix Decrement Changes Value",
            function(){
               set.forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression( 
                                $.PostDecrement(a))))
                                
                        .test($.Expression(a))
                            .type('number', +x.value - 1);
                });
            }],
            ["Postfix Decrement Return Value",
            function(){
                set.forEach(function(x){
                    expect.run(
                        $.Program(
                            $.Var(
                                 $.Declarator(a, x)),
                            $.Expression(
                                $.PostDecrement(a))))
                                
                        .testResult()
                            .type('number', +x.value);
                });
            }],
        ],
    };
});
