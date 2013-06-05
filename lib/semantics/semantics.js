/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/semantics/declaration',
        'atum/semantics/expression',
        'atum/semantics/program',
        'atum/semantics/statement',
        'atum/semantics/value'],
function(declaration,
        expression,
        program,
        statement,
        value){
"use strict";

/* Export
 ******************************************************************************/
return {
// Declaration Semantics
    'variableDeclaration': declaration.variableDeclaration,
    'variableInitDeclarator': declaration.variableInitDeclarator,
    'variableDeclarator': declaration.variableDeclarator,
    'functionDeclaration': declaration.functionDeclaration,

// Function Semantics
    'functionExpression': expression.functionExpression,
    'sourceElements': program.sourceElements,
    
// Statement Semantics
    'statementList': statement.statementList,
    'ifStatement': statement.ifStatement,
    'emptyStatement': statement.emptyStatement,
    'expressionStatement': statement.expressionStatement,
    'returnStatement': statement.returnStatement,
    'throwStatement': statement.throwStatement,
    'breakStatement': statement.breakStatement,
    'continueStatement': statement.continueStatement,
    'switchStatement': statement.switchStatement,
    
// Iteration Statement semantics
    'doWhileStatement': statement.doWhileStatement,
    'whileStatement': statement.whileStatement,
    'forStatement': statement.forStatement,
    'forInStatement': statement.forInStatement,
//
    'tryCatchFinallyStatement': statement.tryCatchFinallyStatement,
    'tryCatchStatement': statement.tryCatchStatement,
    'tryFinallyStatement': statement.tryFinallyStatement,
    
// Binary Operator Semantics
    'addOperator': expression.addOperator, 
    'subtractOperator': expression.subtractOperator, 
    'multiplyOperator': expression.multiplyOperator, 
    'divideOperator': expression.divideOperator, 
    'remainderOperator': expression.remainderOperator, 
    
    'leftShiftOperator': expression.leftShiftOperator, 
    'signedRightShiftOperator': expression.signedRightShiftOperator, 
    'unsignedRightShiftOperator': expression.unsignedRightShiftOperator, 
    'bitwiseAndOperator': expression.bitwiseAndOperator,
    'bitwiseXorOperator': expression.bitwiseXorOperator,
    'bitwiseOrOperator': expression.bitwiseOrOperator,

// Binary Comparision Operator Semantics
    'equalOperator': expression.equalOperator,
    'strictEqualOperator': expression.strictEqualOperator,
    'notEqualOperator': expression.notEqualOperator,
    'strictNotEqualOperator': expression.strictNotEqualOperator,
    
//Binary Relational Operator Semantics
    'ltOperator': expression.ltOperator,
    'lteOperator': expression.lteOperator,
    'gtOperator': expression.gtOperator,
    'gteOperator': expression.gteOperator,
    'instanceofOperator': expression.instanceofOperator,
    'inOperator': expression.inOperator,

// Increment and Decrement Operator Semantics
    'prefixIncrement': expression.prefixIncrement,
    'postfixIncrement': expression.postfixIncrement,
    'prefixDecrement': expression.prefixDecrement,
    'postfixDecrement': expression.postfixDecrement,

// Unary Operator Semantics
    'unaryPlusOperator': expression.unaryPlusOperator, 
    'unaryMinusOperator': expression.unaryMinusOperator, 
    'logicalNotOperator': expression.logicalNotOperator, 
    'bitwiseNotOperator': expression.bitwiseNotOperator, 
    'voidOperator': expression.voidOperator, 
    'typeofOperator': expression.typeofOperator, 

// Logical Semantics
    'logicalOr': expression.logicalOr,
    'logicalAnd': expression.logicalAnd,

//
    'callExpression': expression.callExpression,
    'newExpression': expression.newExpression,
    'memberExpression': expression.memberExpression,
    
// Expression Semantics
    'conditionalExpression': expression.conditionalExpression,
    'sequenceExpression': expression.sequenceExpression,
    'thisExpression': expression.thisExpression,
    
// Literals
    'objectLiteral': expression.objectLiteral,
    'arrayLiteral': expression.arrayLiteral,
    
// Assignment
    'assignment': expression.assignment,
    'compoundAssignment': expression.compoundAssignment,

// Values
    'numberLiteral': value.numberLiteral,
    'booleanLiteral': value.booleanLiteral,
    'stringLiteral': value.stringLiteral,
    'nullLiteral': value.nullLiteral,
    'regularExpressionLiteral': value.regularExpressionLiteral,
    'identifier': value.identifier
};

});