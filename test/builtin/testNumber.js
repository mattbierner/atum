define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a');
    var b = $.Id('b');
    var c = $.Id('c');

    var Number = $.Id('Number');
    
    return {
        'module': "Builtin Number",
        'tests': [
            ["Number(x) converts to number",
            function(){
                [$.Number(1), $.String("10", $.String('abc')), $.Boolean(false)].forEach(function(x){
                    var root = $.Program(
                        $.Expression(
                             $.Call(Number, [x])));
                    
                    expect.type('number', +x.value)(interpret.evaluate(root));
                });
            }],
            ["new Number() unboxes to zero.",
            function(){
                var root = $.Program(
                    $.Expression(
                         $.Add($.New(Number, []), $.Number(100))));
                expect.type('number', 100)(interpret.evaluate(root));
                
                var root = $.Program(
                    $.Expression(
                         $.Add($.New(Number, []), $.String('abc'))));
                expect.type('string', "0abc")(interpret.evaluate(root));
            }],
        ]
    };
});
