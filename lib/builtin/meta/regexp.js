/**
 * @fileOverview Regular expression object meta
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
 * Regular expression object meta
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

RegExp.prototype.setPrototype = function(proto) {
    return new RegExp(proto, this.properties, this.pattern);
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