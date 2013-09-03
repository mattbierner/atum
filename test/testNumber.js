define(['$',
        'expect'],
function($,
        expect){
   
    return {
        'module': "Number",
        'tests': [
            ["Number Literal",
            function(){
                ([10, -10, 1e6, -1e6, 1.5, -1.5]).forEach(function(x) {
                    expect.run(
                        $.Program(
                            $.Expression($.Number(x))))
                        .testResult()
                            .type('number', x);
                });
            }],
            ["Binary Plus Number",
            function(){
                 ([10, -10, 1e6, -1e6, 1.5, -1.5]).forEach(function(x) {
                    expect.run(
                        $.Program(
                            $.Expression($.Add($.Number(x), $.Number(10)))))
                            
                        .testResult()
                            .type('number', x + 10);
                });
            }],
            ["String->Number",
            function(){
                ([["3.3e10", 3.3e10], ["  10  ", 10]]).forEach(function(x) {
                    expect.run(
                        $.Program(
                            $.Expression($.Plus($.String(x[0])))))
                            
                        .testResult()
                            .type('number', x[1]);
                });
            }],
      
        ],
    };
});
