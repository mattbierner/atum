/**
 * @fileOverview Hosted regular expression object meta.
 */
var HostRegExp = RegExp;

define(['exports',
        'atum/builtin/meta/object',
        'atum/value/boolean',
        'atum/value/property',
        'atum/value/string'],
function(exports,
        meta_object,
        boolean,
        property,
        string){
"use strict";

/* RegExp
 ******************************************************************************/
/**
 * Hosted regular expression object meta.
 */
var RegExp = function(proto, props, pattern) {
    meta_object.Object.call(this, proto, props);
    this.pattern = pattern;
};
RegExp.prototype = new meta_object.Object;
RegExp.prototype.constructor = RegExp; 

RegExp.prototype.cls = "RegExp";

Object.defineProperty(RegExp.prototype, 'regExp', {
    'get': function() {
        return new HostRegExp(this.pattern.body, this.pattern.flags);
    }
});

RegExp.prototype.setProperties = function(properties) {
    return new RegExp(this.proto, properties, this.pattern);
};

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
        return property.createValueProperty(
            new string.String(this.pattern.body),
            false,
            false,
            false);
    case 'global':
        return property.createValueProperty(
            new boolean.Boolean(this.pattern.flags.indexOf('g') !== -1),
            false,
            false,
            false);
    case 'ignoreCase':
        return property.createValueProperty(
            new boolean.Boolean(this.pattern.flags.indexOf('i') !== -1),
            false,
            false,
            false);
    case 'multiline':
        return property.createValueProperty(
            new boolean.Boolean(this.pattern.flags.indexOf('m') !== -1),
            false,
            false,
            false);
    default:
        return null;
    }
};


/* Export
 ******************************************************************************/
exports.RegExp = RegExp;

});