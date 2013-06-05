/**
 * @fileOverview ECMAScript 5.1 semantics.
 */
define(['atum/compute',
        'atum/semantics/declaration',
        'atum/semantics/expression',
        'atum/semantics/statement'],
function(compute,
        declaration,
        expression,
        statement){
//"use strict";


/* Program and Function Semantics
 ******************************************************************************/
/**
 * Semantics for the body of a program or function.
 * 
 * Evaluates statements in order until a completion is found or no more statements
 * are left.
 * 
 * @param statements Array of statement computations to evaluate in order.
 * @param [declarations] Array of declarations to evaluate before evaluating any
 *    statements
 */
var sourceElements = function(statements, declarations) {
    return (declarations ?
        compute.next(
            compute.sequence.apply(undefined, declarations),
            statement.statementList(statements)) :
        statement.statementList(statements));
};


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
    'sourceElements': sourceElements,
    
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
    'numberLiteral': expression.numberLiteral,
    'booleanLiteral': expression.booleanLiteral,
    'stringLiteral': expression.stringLiteral,
    'nullLiteral': expression.nullLiteral,
    'regularExpressionLiteral': expression.regularExpressionLiteral,
    'identifier': expression.identifier
};

});