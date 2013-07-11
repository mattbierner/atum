define(['$',
        'expect',
        'atum/interpret'],
function($,
        expect,
        interpret){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');
    
    return {
        'module': "Logical Expressions",
        'tests': [
        // Logical And
            ["Logical And short",
            function(){
                expect.run(
                    $.Program(
                        $.Var(
                             $.Declarator(a, $.Number(0)),
                             $.Declarator(b, $.Number(10))),
                        $.Expression( 
                            $.LogicalAnd($.PostIncrement(a), $.PostIncrement(b)))))
                    .type(
                        $.Expression(a),
                        'number',
                        1);
            }],
        ],
    };
});
