define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    return {
        'module': "Try",
        'tests': [
            ["nothrow try catch",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Expression($.Assign(b, $.Number(10)))),
                        $.Catch(a,
                            $.Block(
                                $.Expression($.Assign(b, $.Number(20)))))),
                    $.Expression(b));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["nothrow try catch yield",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Expression($.Number(10))),
                        $.Catch(a,
                            $.Block(
                                $.Expression($.Number(20))))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["throw try catch",
            function(){
                var root = $.Program(
                    $.Assign(b, $.Number(0)),
                    $.Try(
                        $.Block(
                            $.Expression($.PostIncrement(b)),
                            $.Throw($.Number(10)),
                            $.Expression($.PostIncrement(b))),
                        $.Catch(a,
                            $.Block(
                                $.Expression($.AddAssign(b, a))))),
                    $.Expression(b));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 11);
            }],
            ["throw try catch yield",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Expression($.Number(10)),
                            $.Throw($.Number(30))),
                        $.Catch(a,
                            $.Block(
                                $.Expression($.Number(20))))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 20);
            }],
            ["throw try empty catch yield from catch body",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Expression($.Number(10)),
                            $.Throw($.Number(10))),
                        $.Catch(a,
                            $.Block())));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
             ["throw try empty catch yield from pre",
            function(){
                var root = $.Program(
                    $.Expression($.Number(10)),
                    $.Try(
                        $.Block(
                            $.Throw($.Number(10))),
                        $.Catch(a,
                            $.Block())));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["throw finally no catch",
            function(){
                var root = $.Program(
                    $.Assign(b, $.Number(1)),
                    $.Try(
                        $.Block(
                            $.Try(
                                $.Block(
                                    $.Expression($.PostIncrement(b)),
                                    $.Throw($.Number(10)),
                                    $.Expression($.PostIncrement(b))),
                                null,
                                $.Block(
                                    $.Expression($.Assign(b, $.Mul(b, b)))))),
                        $.Catch(a, $.Block())),
                    $.Expression(b));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 4);
            }],
            ["No throw finally no catch",
            function(){
                var root = $.Program(
                    $.Assign(b, $.Number(1)),
                    $.Try(
                        $.Block(
                            $.Try(
                                $.Block(
                                    $.Expression($.PostIncrement(b))),
                                null,
                                $.Block(
                                    $.Expression($.Assign(b, $.Mul(b, b)))))),
                        $.Catch(a, $.Block())),
                    $.Expression(b));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 4);
            }],
           
        ]
    };
});
