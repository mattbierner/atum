/**
 */
require(['knockout-2.2.1',
        'parse/parse',
        'nu/stream',
        'atum/interpret',
        'atum/compute',
        'atum/debug/debugger',
        'ecma/lex/lexer', 'ecma/parse/parser'],
function(ko,
        parse,
        stream,
        interpret,
        compute,
        atum_debugger,
        lexer, parser) {

var reduce = Function.prototype.call.bind(Array.prototype.reduce);

var get = function(p, c) {
    return p[c];
};

var format = function(str, obj) {
    return str.replace(/@@|@([a-z][a-z0-9\.]*)|@/gi, function(path) {
        if (path === '@')
            return obj;
        else if (path === '@@')
            return '@';
        return reduce(path, get, obj);
    });
};

/* 
 ******************************************************************************/
var printBindings = function(d, record) {
    return Object.keys(record).reduce(function(p, c) {
        p.push({'name': c, 'value': record[c] });
        return p;
    }, []);
};


var printFrame = function(d, lex) {
    return {
        'bindings': printBindings(d, lex.record)
    };
};

var printState = function(d, ctx) {
    if (!ctx.userData)
        return;
    
    var environment = d.getValue(ctx.userData.lexicalEnvironment);
    model.environments.removeAll();
    do {
        model.environments.push(printFrame(d, environment));
        environment = d.getValue(environment.outer);
    } while (environment);
};

/* 
 ******************************************************************************/
var out = {
    'write': function(x) {
        $('#text_out').text(x);
    },
    'clear': function(x) {
        $('#text_out').text('');
    }
};

var errorOut = {
    'write': function(x) {
        $('#ParseError').text(x);
    },
    'clear': function(x) {
        $('#ParseError').text('');
    }
};

var run = function (input, ok, err) {
    try {
        return ok(interpret.interpret(parser.parseStream(lexer.lexRegExp(input))));
    } catch (e) {
        return err(e);
    }
};


/* 
 ******************************************************************************/
var doc = CodeMirror(document.getElementById('input'), {
    'mode':  'javascript',
    'lineNumbers': true
}).doc;

var debug;

var ViewModel = function() {
    this.environments = ko.observableArray([]);
};
var model = new ViewModel();
ko.applyBindings(model);

$(function(){
    $('#container').layout();
    
    $('button#eval-button').click(function(e){
        out.clear();
        errorOut.clear()
        run(doc.getValue(), out.write, errorOut.write);
    });
    
    $('button#debug-button').click(function () {
        var input = doc.getValue();
        out.clear();
        errorOut.clear()
        
        try {
            var lex = lexer.lexRegExp(input);
            var ast = parser.parseStream(lex);
            var p = interpret.evaluateProgram(ast);
            var ctx = new compute.ComputeContext({}, null);
            
            debug = atum_debugger.Debugger.create(p, ctx, 
                function(x, ctx){ return function() { $('#text_out').text(x); }; },
                function(x, ctx){ return function() { $('.ParseError').text(x);} });
            
            do {
                printState(debug, debug.ctx);
                debug = debug.step();
            } while (debug && debug instanceof atum_debugger.Debugger);
            
            debug();
        } catch (e) {
            $('.ParseError').text(e);
        }
    });
});

});
