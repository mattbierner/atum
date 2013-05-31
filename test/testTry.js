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
            ["No throw",
            function(){
                var root = $.Program(
                    $.Try(
                        $.Block(
                            $.Expression($.Number(10))),
                        null,
                        $.Block()));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 10);
            }],
            ["Simple Throw",
            function(){
                var root = $.Program(
                    $.Assign(b, $.Number(0)),
                    $.Try(
                        $.Block(
                            $.Expression($.PostIncrement(b)),
                            $.Throw($.Number(10))),
                    $.Catch(a,
                        $.Block(
                            $.Expression($.Add(a, b))))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'number');
                assert.equal(result.value, 11);
            }],
           
        ]
    };
});