define(['$',
        'expect'],
function($,
        expect){
    
    return {
        'module': "String",
        'tests': [
            ["String Literal",
            function(){
                (["", "abc", '""', "''", "a\nb", "e\u0041ab"]).forEach(function(x) {
                    expect.run(
                        $.Program(
                            $.Expression($.String(x))))
                        
                        .testResult()
                            .type('string', x);
                });
            }],
            ["Binary Plus String, Both Sides",
            function(){
               ([['', 'abc'], ['abc', ''], ['ab', 'c']]).forEach(function(x) {
                    expect.run(
                        $.Program(
                            $.Expression(
                                $.Add(
                                    $.String(x[0]),
                                    $.String(x[1])))))
                                    
                        .testResult()
                            .type('string', x[0] + x[1]);
                });
            }],
            ["Binary Plus String Force String Conversion",
            function(){
                expect.run($.Program())
                
                    .test($.Expression($.Add($.Number(10), $.String("abc"))))
                        .type('string', '10abc')
                     
                    .test($.Expression($.Add($.String("abc"), $.Number(10))))
                        .type('string', 'abc10');
            }],
        ],
    };
});
