/**
 * @fileOverview Regular expression object meta
 */
var HostRegExp = RegExp;

define(['exports',
        'amulet/record',
        'atum/builtin/meta/object',
        'atum/value/boolean',
        'atum/value/property',
        'atum/value/string'],
function(exports,
        record,
        meta_object,
        boolean,
        property,
        string){
"use strict";

/* RegExp
 ******************************************************************************/
/**
 * Regular expression object meta
 */
var RegExp = record.extend(meta_object.Object, [
    'pattern']);

RegExp.prototype.cls = "RegExp";

Object.defineProperty(RegExp.prototype, 'regExp', {
    'get': function() {
        return new HostRegExp(this.pattern.body, this.pattern.flags);
    }
});

RegExp.prototype.getOwnPropertyNames = function() {
    return meta_object.Object.prototype.getOwnPropertyNames.call(this)
        .concat(
            'source',
            'global',
            'ignoreCase',
            'multiline');
};

RegExp.prototype.getOwnProperty = function(name) {
    var desc = meta_object.Object.prototype.getOwnProperty.call(this, name);
    if (desc)
        return desc;
    
    switch (name) {
    case 'source':
        return property.createValuePropertyFlags(
            new string.String(this.pattern.body));
    case 'global':
        return property.createValuePropertyFlags(
            new boolean.Boolean(this.pattern.flags.indexOf('g') !== -1));
    case 'ignoreCase':
        return property.createValuePropertyFlags(
            new boolean.Boolean(this.pattern.flags.indexOf('i') !== -1));
    case 'multiline':
        return property.createValuePropertyFlags(
            new boolean.Boolean(this.pattern.flags.indexOf('m') !== -1));
    default:
        return null;
    }
};


/* Export
 ******************************************************************************/
exports.RegExp = RegExp;

});