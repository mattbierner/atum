/**
 * @fileOverview Arguments meta object
 */
define(['exports',
        'atum/builtin/meta/object'],
function(exports,
        meta_object){
"use strict";

/* Arguments
 ******************************************************************************/
/**
 * Arguments meta
 */
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

Arguments.prototype.setProperties = function(properties) {
    return new Arguments(
        this.proto,
        properties,
        this.func,
        this.names,
        this.args,
        this.env,
        this.strict);
};

Arguments.prototype.setPrototype = function(proto) {
    return new Arguments(
        proto,
        this.properties,
        this.func,
        this.names,
        this.args,
        this.env,
        this.strict);
};

/* Export
 ******************************************************************************/
exports.Arguments = Arguments;

});