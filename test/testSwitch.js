define(['$',
        'atum/interpret'],
function($,
        interpret){
    
    var a = $.Id('a');
    
    return {
        'module': "Switch",
        'tests': [
            ["Empty Switch",
            function(){
                var root = $.Program(
                    $.Switch($.Number(0)));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Not Covered Case Switch",
            function(){
                var root = $.Program(
                    $.Switch($.Number(0),
                        $.Case($.Number(5),
                            $.Number(100),
                            $.Break())));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
            ["Covered Cases",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign(a, $.Number(5))),
                    $.Switch(a,
                        $.Case($.Number(1),
                            $.Expression(
                                $.Assign(a, $.Number(0))),
                            $.Break()),
                        $.Case($.Number(5),
                            $.Expression(
                                $.Assign(a, $.Number(1))),
                            $.Break()),
                        $.Case($.Number(10),
                            $.Expression(
                                $.Assign(a, $.Number(2))),
                            $.Break())),
                    $.Expression(a));
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Break Return Last Value",
            function(){
                var root = $.Program(
                    $.Switch($.Number(5),
                        $.Case($.Number(1),
                            $.Expression($.Number(0)),
                            $.Break()),
                        $.Case($.Number(5),
                             $.Expression($.Number(1)),
                            $.Break()),
                        $.Case($.Number(10),
                             $.Expression($.Number(2)),
                             $.Break())));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Covered Case Fall",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign(a, $.Number(5))),
                    $.Switch(a,
                        $.Case($.Number(1),
                            $.Expression(
                                $.Assign(a, $.Number(0)))),
                        $.Case($.Number(5),
                            $.Expression(
                                $.AddAssign(a, $.Number(1)))),
                        $.Case($.Number(10),
                            $.Expression(
                                $.AddAssign(a, $.Number(2))))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 8);
            }],
            ["Default Case",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign(a, $.Number(5))),
                    $.Switch(a,
                        $.Case($.Number(1),
                            $.Expression(
                                $.Assign(a, $.Number(0))),
                            $.Break()),
                        $.Case(null,
                            $.Expression(
                                $.Assign(a, $.Number(1))),
                            $.Break()),
                        $.Case($.Number(10),
                            $.Expression(
                                $.Assign(a, $.Number(2))),
                                $.Break())),
                    $.Expression(a));
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 1);
            }],
            ["Default Case Fall",
            function(){
                var root = $.Program(
                    $.Expression(
                        $.Assign(a, $.Number(5))),
                    $.Switch(a,
                        $.Case($.Number(1),
                            $.Expression(
                                $.Assign(a, $.Number(0))),
                            $.Break()),
                        $.Case(null,
                            $.Expression(
                                $.AddAssign(a, $.Number(1)))),
                        $.Case($.Number(10),
                            $.Expression(
                                $.AddAssign(a, $.Number(2))))),
                    $.Expression(a));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 8);
            }],
        ],
    };
});
