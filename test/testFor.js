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
            ["Never Run For",
            function(){
                var root = $.Program(
                    $.For(null, $.Boolean(false), null,
                        $.Expression($.Number(1))));
                
                var result = interpret.interpret(root);
                assert.equal(result.type, 'undefined');
                assert.equal(result.value, undefined);
            }],
        ]
    };
});
