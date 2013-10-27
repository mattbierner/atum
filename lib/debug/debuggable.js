/**
 * @fileOverview Record for a debuggable state.
 */
define(['amulet/record'],
function(record) {
"use strict";

/* Debuggable
 ******************************************************************************/
var Debuggable = record.declare(null, [
    'k',
    'ctx']);
Debuggable.type = 'Debuggable';

var StatementDebuggable = record.extend(Debuggable, []);
StatementDebuggable.type = 'Statement'

var ExpressionDebuggable = record.extend(Debuggable, []);
ExpressionDebuggable.type = 'Expression';

var DebuggerDebuggable = record.extend(Debuggable, []);
DebuggerDebuggable.type = 'Debugger';

var PreCallDebuggable = record.extend(Debuggable, []);
PreCallDebuggable.type = 'PreCall';

var PostCallDebuggable = record.extend(Debuggable, []);
PostCallDebuggable.type = 'PostCall';

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