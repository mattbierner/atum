/**
 * @fileOverview 
 */
define(['exports',
        'atum/compute',
        'atum/builtin/args',
        'atum/operations/object',
        'atum/operations/value_reference'],
function(exports,
        compute,
        args_ref,
        object,
        value_reference){
//"use strict";

/* Operations
 ******************************************************************************/
var createArgumentsObject = function(func, names, args, env, strict) {
    var len = args.length;
    var map = {};
    var mappedNames = [];
    var props = {};
    for (var indx = len - 1; indx >= 0; --indx) {
        props[indx] = {
            'value': compute.just(args.getArg(indx)),
            'writable': true,
            'enumerable': true,
            'configurable': true
        }
        if (indx < names.length) {
            var name = names[indx];
            if (!strict && !mappedNames.indexOf(name)) {
                var g;
                var p;
                props[indx] = {
                    'set': compute.just(p),
                    'get': compute.just(g),
                    'configurable': true
                };
            }
        }
    }
    return object.defineProperties(
        object.construct(compute.just(args_ref.Arguments), compute.enumeration()),
        props);
};
/* Export
 ******************************************************************************/
exports.createArgumentsObject = createArgumentsObject;

});