define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    return {
        'module': "For",
        'tests': [
            ["Zero Iteration For",
            function(){
                // returns undefined
                var root = $.Program(
                    $.For(null, $.Boolean(false), null,
                        $.Expression($.Number(1))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
                
                // Init run and test one run once
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), $.PostIncrement(a), null,
                        $.Expression($.Number(10))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Return Last Iteration Body Value",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(5)), $.PreIncrement(a),
                        $.Expression(a)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 4);
            }],
            ["Init run once, test run iteration + 1 times",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), $.Lt($.PostIncrement(a), $.Number(5)), null,
                        $.Expression(a)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 5);
            }],
            ["Nested For",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), $.Lt($.PostIncrement(a), $.Number(3)), null,
                        $.For($.Assign(b, $.Number(0)), $.Lt($.PostIncrement(b), $.Number(4)), null,
                            $.Expression($.Mul(a, b)))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 12);
            }],
            ["Continue",
            function(){
                var root = $.Program(
                    $.Assign(b, $.Number(0)),
                    $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(10)), $.PreIncrement(a),
                        $.If($.Mod(a, $.Number(2)),
                            $.Continue(),
                            $.Expression($.PreIncrement(b)))),
                    $.Expression(b));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 5);
            }],
            ["Continue Yielded Value",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(10)), $.PreIncrement(a),
                        $.Block(
                            $.Expression(a),
                            $.Continue())));

                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 9);
            }],
            ["Continue Yielded Value across iterations",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(10)), $.PreIncrement(a),
                        $.Block(
                            $.If($.Mod(a, $.Number(2)),
                                $.Continue(),
                                $.Expression(a)))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 8);
            }],
            ["Nested For Continue",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), $.Lt(a, $.Number(3)), $.PreIncrement(a),
                        $.Block(
                            $.For($.Assign(b, $.Number(0)), $.Lt(b, $.Number(4)), $.PreIncrement(b),
                                $.Block(
                                    $.If($.Mod(a, $.Number(2)),
                                        $.Continue(),
                                        $.Expression($.Mul(a, b))))))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],
            ["Break",
            function(){
                var root = $.Program(
                    $.Assign(b, $.Number(0)),
                    $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                        $.If($.Gt(a, $.Number(5)),
                            $.Block(
                                $.Break(),
                                $.Assign(a, $.Number(100))),
                            $.Expression($.PreIncrement(b)))),
                    $.Expression(b));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],
            ["Break",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                        $.If($.Gt(a, $.Number(5)),
                            $.Break())),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],
            ["Break Yielded value",
            function(){
                var root = $.Program(
                    $.For($.Assign(a, $.Number(0)), null, $.PreIncrement(a),
                        $.If($.Gt(a, $.Number(5)),
                            $.Block(
                                $.Expression(a),
                                $.Break()),
                            null)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 6);
            }],
        ]
    };
});
