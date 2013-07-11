define(['$',
        'atum/interpret'],
function($,
        interpret){
    
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
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression( 
                            $.PreIncrement(a)),
                        $.Expression(a));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value + 1);
                });
            }],
            ["Prefix Increment Return Value",
            function(){
                set.forEach(function(x){
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression( 
                            $.PreIncrement(a)));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value + 1);
                });
            }],
            
        // Prefix Decrement 
            ["Prefix Decrement Changes Value",
            function(){
                set.forEach(function(x){
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression( 
                            $.PreDecrement(a)),
                        $.Expression( a));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value - 1);
                });
            }],
            ["Prefix Decrement Return Value",
            function(){
                set.forEach(function(x){
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression( 
                            $.PreDecrement(a)));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value - 1);
                });
            }],
            
         // Postfix Increment 
            ["Postfix Increment Changes Value",
            function(){
                set.forEach(function(x){
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression( 
                            $.PostIncrement(a)),
                        $.Expression( a));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value + 1);
                });
            }],
            ["Postfix Increment Return Value",
            function(){
                set.forEach(function(x){
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression( 
                            $.PostIncrement(a)));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value);
                });
            }],
            
        // Postfix Decrement 
            ["Postfix Decrement Changes Value",
            function(){
               set.forEach(function(x){
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression( 
                            $.PostDecrement(a)),
                        $.Expression( a));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value - 1);
                });
            }],
            ["Postfix Decrement Return Value",
            function(){
                set.forEach(function(x){
                    var root = $.Program(
                        $.Var(
                             $.Declarator(a, x)),
                        $.Expression(
                            $.PostDecrement(a)));
                    
                    var result = interpret.evaluate(root);
                    assert.equal(result.type, 'number');
                    assert.equal(result.value, +x.value);
                });
            }],
        ],
    };
});
