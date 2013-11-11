/**
 * @fileOverview Regular expression builtin operations
 */
define(['exports',
        'atum/builtin/regexp',
        'atum/operations/construct',
        'atum/value/string'],
function(exports,
        regexp_builtin,
        construct,
        string){
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Create a new regular expression object
 * 
 * @param body Hosted string for body of regular expression.
 * @param flags Hosted string for flags on expression
 */
var create = function(body, flags) {
    return construct.construct(
        regexp_builtin.RegExp,
        [body, flags]);
};

var createFromHost = function(body, flags) {
    return create(
        new string.String(body),
        new string.String(flags));
};

/* Export
 ******************************************************************************/
exports.create = create;
exports.createFromHost = createFromHost;

});