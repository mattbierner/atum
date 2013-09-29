/**
 * @fileOverview Interface for references used internally.
 */
define(['atum/reference'],
function(reference){
"use strict";

/* InternalReference
 ******************************************************************************/
/**
 * Interface / marker class for references used in the interpreter implementation.
 */
var InternalReference = function() { };

InternalReference.prototype = new reference.Reference;

/* Export
 ******************************************************************************/
return {
    'InternalReference': InternalReference
};

});