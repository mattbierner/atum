define(['$',
        'expect'],
function($,
        expect){
    
    var a = $.Id('a'),
        b = $.Id('b'),
        c = $.Id('c');
    
    return {
        'module': "Unary Tests",
        'tests': [
        // void
            ["Void",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Void($.Number(10)))))
                        
                    .testResult()
                        .type('undefined', undefined);
            }],
            ["Void Side Effects",
            function(){
                expect.run(
                    $.Program(
                        $.Expression($.Sequence(
                            $.Assign(a, $.Number(0)),
                            $.Void($.PreIncrement(a)),
                            a))))
                            
                    .testResult()
                        .type('number', 1);
            }],
        // Unary plus
            ["Unary Plus Number",
            function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                          expect.run(
                              $.Program(
                                  $.Expression($.Plus($.Number(x)))))
                                  
                              .testResult()
                                  .type('number', x);
                    });
            }],
        // Unary Minus
           ["Unary Minus Number",
           function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5])
                    .forEach(function(x) {
                        expect.run(
                            $.Program(
                                $.Expression($.Negate($.Number(x)))))
                                
                            .testResult()
                                .type('number', -x);

                    });
            }],
        
        // Logical Not
            ["Logical Not Boolean",
             function(){
                 ([true, false])
                    .forEach(function(x) {
                        expect.run(
                            $.Program(
                                $.Expression($.LogicalNot($.Boolean(x)))))
                                
                            .testResult()
                                .type('boolean', !x);
                    });
            }],
        
        // Bitwise Not
            ["Bitwise Not",
             function(){
                ([$.Number(1),
                  $.Number(1.5),
                  $.Number(-1),
                  $.String("1")])
                   .forEach(function(x) {
                        expect.run(
                            $.Program(
                                $.Expression($.BitwiseNot(x))))
                            
                            .testResult()
                                .type('number', ~x.value);
                    });
            }],
            
        // Typeof 
            ["Typeof string",
             function(){
                expect.run(
                    $.Program(
                        $.Expression($.Typeof($.String("")))))
                        
                    .testResult()
                        .type('string', 'string');
            }],
        ],
    };
});
