/**
 * @fileOverview Primitive regular expression operations.
 */
define([],
function() {
"use strict";

/* Operations
 ******************************************************************************/
/**
 * Match a regular expression against a string.
 * 
 * @param str Hosted string to match against.
 * @param regexp Host regular expression used for matching.
 * 
 * @return Host array of hosted string matches. May be empty.
 */
var match = function(str, regexp) {
    return (str.value.match(regexp) || []);
};

/**
 * Replace all occurrences of `search` in `str` with `replacement`.
 * 
 * @param str Hosted string operated on.
 * @param search Hosted string to search for in `str`.
 * @param replacement Hosted string to replace found values with.
 * 
 * @return Hosted string.
 */
var splitString = function(str, search) {
    var found = [];
    str.value.replace(search.value, function(match /*, ...*/) {
        found.push([].slice.call(arguments));
    });
    var last = 0;
    var arr = found.reduce(function(p, c) {
        var next = c[c.length - 2];
        var z = p.concat([[str.value.slice(last, next)]], [c]);
        last = next + c[0].length;
        return z;
    }, []);
    return arr.concat([[str.value.slice(last)]]);
};

/**
 * 
 */
var splitRegexp = function(str, regexp, replacement) {
    var found = [];
    str.value.replace(regexp, function(match /*, ...*/) {
        found.push([].slice.call(arguments));
    });
    var last = 0;
    var arr = found.reduce(function(p, c) {
        var next = c[c.length - 2];
        var z = p.concat([[str.value.slice(last, next)]], [c]);
        last = next + c[0].length;
        return z;
    }, []);
    return arr.concat([[str.value.slice(last)]]);}

/* Export
 ******************************************************************************/
return {
    'match': match,
    'splitString': splitString,
    'splitRegexp': splitRegexp
};

});