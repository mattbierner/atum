/**
 * @fileOverview Arguments meta object
 */
define(['exports',
        'amulet/object',
        'atum/compute',
        'atum/builtin/meta/object',
        'atum/operations/number',
        'atum/operations/object'],
function(exports,
        amulet_object,
        compute,
        meta_object,
        number,
        object){
//"use strict";

/* Error
 ******************************************************************************/
var Arguments = function(proto, props, func, names, args, env, strict) {
    meta_object.Object.call(this, proto, props);
    this.func = func;
    this.names = names;
    this.args = args;
    this.env = env;
    this.strict = strict;
};
Arguments.prototype = new meta_object.Object;
Arguments.prototype.constructor = Arguments;

Arguments.prototype.cls = "Arguments";

Arguments.prototype.defineOwnProperty = function(ref, name, desc) {
    var properties = amulet_object.defineProperty(this.properties, name, {
        'value': desc,
        'enumerable': true
    });
    return ref.setValue(new Arguments(
        this.proto,
        properties,
        this.func,
        this.names,
        this.args,
        this.env,
        this.strict));
};


/* Export
 ******************************************************************************/
exports.Arguments = Arguments;

});