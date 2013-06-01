define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    return {
        'module': "Conditional Tests",
        'tests': [
            ["Simple If True Statement",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a)),
                    $.If(
                        $.Boolean(true),
                        $.Expression(
                            $.Assign(a, $.Number(1)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Simple If True Statement yielded",
            function(){
                var root = $.Program(
                    $.If(
                        $.Boolean(true),
                        $.Expression($.Number(1))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Simple If false Statement",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a)),
                    $.If(
                        $.Boolean(false),
                        $.Expression(
                            $.Assign(a, $.Number(1)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
            }],
            ["Simple If false Statement yielded",
            function(){
                var root = $.Program(
                    $.Expression($.Number(5)),
                    $.If(
                        $.Boolean(false),
                        $.Expression($.Number(1))));
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 5);
            }],
            ["Simple If True Else Statement",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a)),
                    $.If(
                        $.Boolean(true),
                        $.Expression(
                            $.Assign(a, $.Number(1))),
                        $.Expression(
                            $.Assign(a, $.Number(10)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Simple If False Else Statement",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a)),
                    $.If(
                        $.Boolean(false),
                        $.Expression(
                            $.Assign(a, $.Number(1))),
                        $.Expression(
                            $.Assign(a, $.Number(10)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["If Statement True Test Side Effects",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a, $.Number(0))),
                    $.If(
                        $.PreIncrement(a),
                        $.Expression(
                            $.AddAssign(a, $.Number(1))),
                        $.Expression(
                            $.AddAssign(a, $.Number(10)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            ["If Statement False Test Side Effects",
            function(){
                var root = $.Program(
                    $.Var(
                        $.Declarator(a, $.Number(0))),
                    $.If(
                        $.PostIncrement(a),
                        $.Expression(
                            $.AddAssign(a, $.Number(1))),
                        $.Expression(
                            $.AddAssign(a, $.Number(10)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 11);
            }],
            
        ]
    };
});
