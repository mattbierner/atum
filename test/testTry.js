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
            ["throw try catch, catch var used outside of catch block is error",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Throw($.Number(10))),
                        $.Catch(a,
                            $.Block())),
                    $.Expression(a));
                
                assert.throws(interpret.interpret.bind(undefined, root));
            }],
            ["throw try catch, catch var hides and does not mutate current binding",
            function(){
                var root = $.Program(
                    $.Expression($.Assign(a, $.Number(2))),
                    $.Try(
                        $.Block(
                            $.Throw($.Number(3))),
                        $.Catch(a,
                            $.Block(
                                $.AddAssign(a, a)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
            ["throw try catch, catch scope assign back to global",
            function(){
                var root = $.Program(
                    $.Expression($.Assign(a, $.Number(2))),
                    $.Try(
                        $.Block(
                            $.Throw($.Number(3))),
                        $.Catch(a,
                            $.Block(
                                $.AddAssign($.Member($.This(), a), a)))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 5);
            }],
            ["throw try empty catch yield from catch body",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Expression($.Number(10)),
                            $.Throw($.Number(100))),
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
            ["Nothrow finally no catch",
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
            ["Throw, catch also throws",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Try(
                                $.Block(
                                    $.Throw($.Number(10))),
                                $.Catch(a,
                                    $.Block(
                                        $.Throw(a))))),
                        $.Catch(a,
                            $.Block(
                                $.Expression(a)))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Throw, catch also throws",
            function(){
                var root = $.Program(
                    $.Expression($.Assign(b, $.Number(1))),
                    $.Try(
                        $.Block(
                            $.Try(
                                $.Block(
                                    $.Expression($.Assign(b, $.Number(2))),
                                    $.Throw($.Number(b)),
                                    $.Expression($.Assign(b, $.Number(3)))),
                                $.Catch(a,
                                    $.Block(
                                        $.Expression($.AddAssign(b, $.Number(8))),
                                        $.Throw(a),
                                        $.Expression($.AddAssign(b, $.Number(16))))))),
                        $.Catch(a,
                            $.Block(
                                $.Expression(b)))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Throw, catch also throws with finally",
            function(){
                var root = $.Program(
                    $.Expression($.Assign(b, $.Number(1))),
                    $.Try(
                        $.Block(
                            $.Try(
                                $.Block(
                                    $.Expression($.Assign(b, $.Number(2))),
                                    $.Throw(b),
                                    $.Expression($.Assign(b, $.Number(3)))),
                                $.Catch(a,
                                    $.Block(
                                        $.Expression($.AddAssign(b, $.Number(8))),
                                        $.Throw(a),
                                        $.Expression($.AddAssign(b, $.Number(16))))),
                                $.Block(
                                    $.Expression($.AddAssign(b, $.Number(100)))))),
                        $.Catch(a,
                            $.Block(
                                $.Expression($.AddAssign(b, a))))),
                        $.Expression(b));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 112);
            }],
            ["Throw, catch return and finally return",
            function(){
                var root = $.Program(
                    $.FunctionDeclaration(a, [], $.Block(
                        $.Try(
                            $.Block(
                                $.Return(b)),
                            $.Catch(b,
                                $.Block(
                                    $.Return($.Number(1)))),
                            $.Block(
                                $.Return($.Number(2)))))),
                    $.Expression($.Call(a, [])));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 2);
            }],
        ]
    };
});
