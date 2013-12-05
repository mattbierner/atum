/**
 */
require(['knockout-2.2.1',
        'parse/parse',
        'nu/stream',
        'atum/interpret',
        'atum/compute',
        'atum/compute/context',
        'atum/builtin/impl/global',
        'atum/builtin/operations/global',
        'atum/operations/object',
        'atum/semantics/semantics',
        'ecma/lex/lexer',
        'ecma/parse/parser'],
function(ko,
        parse,
        stream,
        interpret,
        compute,
        context,
        global,
        global_operations,
        object,
        semantics,
        lexer,
        parser) {

var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);

var get = function(p, c) {
    return p[c];
};

/* 
 ******************************************************************************/
var out = {
    'write': function(x, ctx) {
        model.push(false, x);
    }
};

var errorOut = {
    'write': function(x, ctx) {
        model.push(true, x);
    }
};

var run = function (input, ok, err) {
    try {
        var ast = parser.parse(input);
    } catch(e) {
        return err(e, null)();
    }
    return interpret.exec(
        semantics.programBody(semantics.sourceElements(ast.body)),
        globalCtx,
        ok,
        err);
};

/* Code Mirror
 ******************************************************************************/
var doc = CodeMirror(document.getElementById('input'), {
    'mode': 'javascript',
    'lineNumbers': true
}).doc;

/* ConsoleViewModel
 ******************************************************************************/
var ConsoleViewModel = function() {
    var self = this;
    
    this.output = ko.observableArray();
};

ConsoleViewModel.prototype.finish = function() {
    return this.debug(this.debug().finish());
};

ConsoleViewModel.prototype.run = function() {
    return this.debug(this.debug().stepToDebugger());
};

ConsoleViewModel.prototype.push = function(error, value) {
    return this.output.push({
        'error': error,
        'value': value 
    });
};


/* 
 ******************************************************************************/
var model = new ConsoleViewModel();
ko.applyBindings(model);

var globalCtx = interpret.exec(
    compute.sequence(
        global.initialize(),
        global_operations.enterGlobal(),
        compute.computeContext),
    context.ComputeContext.empty,
    function(x) { return x },
    function(x) { return x });

$(function(){
    $('#container').layout();

    $('button#eval-button')
        .button()
        .click(function(e){
            run(doc.getValue(), out.write, errorOut.write);
                $('.object-browser')
                    .accordion({
                        'collapsible': true,
                        'animate': 100
                    });
        });
});

});
