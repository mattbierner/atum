/**
 */
require(['knockout-2.2.1',
        'atum/interpret',
        'atum/compute',
        'atum/compute/context',
        'atum/builtin/impl/global',
        'atum/builtin/operations/global',
        'atum/operations/evaluation',
        'atum/semantics/semantics',
        'ecma/parse/parser'],
function(ko,
        interpret,
        compute,
        context,
        global,
        global_operations,
        evaluation) {

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
    console.profile();
    return interpret.exec(
        evaluation.evaluateText(input),
        globalCtx,
        function(x, ctx) {
            console.profileEnd();
            return ok(x, ctx);
        },
        function(x, ctx) {
            console.profileEnd();
            return err(x, ctx);
        },
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
    $('button#eval-button').on('click', function(e){
        run(doc.getValue(), out.write, errorOut.write);
    });
});

});
