/**
 * 
 */
requirejs.config({
    paths: {
        'atum': 'lib',
        'amulet': 'dependencies/amulet/lib',
        'parse': 'dependencies/parse/lib',
        'nu': 'dependencies/nu/lib',
        'ecma': 'dependencies/parse-ecma/lib',
    }
});

require([
        'parse/parse',
        'nu/stream',
        'atum/interpret',
        'atum/compute',
        'atum/debug/debugger',
        'ecma/lex/lexer', 'ecma/parse/parser'],
function(parse,
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
var printFrame = function(d, lex) {
    var d = $('<ul></ul>');
    Object.keys(lex.record).forEach(function(x) {
        d.append('<li>' + x + ': ' + lex.record[x] + '</li>');
    });
    return d;
};

var printState = function(d, ctx) {
    if (!ctx.userData)
        return;
    
    var template = $("<li class='environment'></li>");
    $('.environments').empty();
    var lex = d.getValue(ctx.userData.lexicalEnvironment);
    while (lex) {
        $('.environments').append($("<li class='environment'></li>").append(printFrame(d, lex)));
        lex = d.getValue(lex.outer);
    }
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
