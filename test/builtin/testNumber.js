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
            ["Set on number",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(Number, []))),
                         $.Expression(
                             $.Assign($.Member(a, b), $.Number(10)))))
                     .test($.Expression($.Add(a, $.Member(a, b))))
                         .type('number', 10);
            }],
            ["`Number.prototype.valueOf`",
            function(){
                expect.run(
                    $.Program(
                        $.Expression(
                             $.Assign(a, $.New(Number, [$.Number(3)]))),
                         $.Expression(
                             $.Assign(b, $.Number(10)))))
                     .test($.Expression($.Call($.Member(a, $.Id('valueOf')), [])))
                         .type('number', 3)
                     .test(
                         $.Expression(
                             $.Call(
                                 $.Member($.Member($.Member(Number, $.Id('prototype')), $.Id('valueOf')), $.Id('call')),
                                 [b])))
                         .type('number', 10);
            }],
        ]
    };
});
