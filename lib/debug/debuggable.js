/**
 * @fileOverview Record for a debuggable state.
 */
define(['amulet/record'],
function(record){
"use strict";

/* Debuggable
 ******************************************************************************/
var Debuggable = record.declare(null, [
    'k',
    'ctx']);

var StatementDebuggable = record.extend(Debuggable, []);

var ExpressionDebuggable = record.extend(Debuggable, []);

var DebuggerDebuggable = record.extend(Debuggable, []);

var PreCallDebuggable = record.extend(Debuggable, []);

var PostCallDebuggable = record.extend(Debuggable, []);

/* Export
 ******************************************************************************/
return {
    'Debuggable': Debuggable,
    
    'StatementDebuggable': StatementDebuggable,
    'ExpressionDebuggable': ExpressionDebuggable,
    
    'DebuggerDebuggable': DebuggerDebuggable,
    
    'PreCallDebuggable': PreCallDebuggable,
    'PostCallDebuggable': PostCallDebuggable
};

});