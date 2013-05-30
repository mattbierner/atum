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
        ]
    };
});
