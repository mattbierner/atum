/**
 * @fileOverview ECMAScript 5.1 statement semantics.
 */
define(['atum/compute',
        'atum/completion',
        'atum/fun',
        'atum/compute/statement',
        'atum/operations/boolean',
        'atum/semantics/expression',
        'atum/semantics/statement'],
function(compute,
        completion,
        fun,
        statement,
        boolean,
        expression,
        statement_flow){
"use strict";

/* Statement Semantics
 ******************************************************************************/
/**
 * Empty statement.
 * 
 * Completes normally without a value.
 */
var emptyStatement = compute.createBlock(statement_flow.emptyStatement);

/**
 * Expression statement
 * 
 * Evaluates an expression and completes normally with the result.
 * 
 * @param expr Expression to evaluate.
 */
var expressionStatement = fun.compose(
    compute.createBlock,
    statement_flow.expressionStatement);

/**
 * Block statement
 * 
 * Evaluates a sequence of statements in order
 * 
 * @param expression Array of statements.
 */
var blockStatement = fun.compose(
    compute.createBlock,
    fun.compose(
        statement_flow.blockStatement,
        fun.curry(fun.map, compute.dispatch)));

/**
 * With statement
 * 
 * Creates a new object environment from the result of an expression and evaluates
 * a statement in this environment.
 * 
 * @param expr Expr giving object for object environment.
 * @param body Statement to evaluate in the resulting object environment.
 */
var withStatement = fun.compose(
    compute.createBlock,
    function(expr, body) {
        return statement_flow.withStatement(
            expr,
            compute.dispatch(body));
    });

/* Completion Statements
 ******************************************************************************/
/**
 * Return statement
 * 
 * @param [argument] Computation of value to return.
 */
var returnStatement = fun.compose(
    compute.createBlock,
    statement_flow.returnStatement);

/**
 * Throw statement
 * 
 * @param argument Computation of value to throw.
 */
var throwStatement = fun.compose(
    compute.createBlock,
    statement_flow.throwStatement);

/**
 * Break statement
 * 
 * @param {String} [label]
 */
var breakStatement = fun.compose(
    compute.createBlock,
    statement_flow.breakStatement);

/**
 * Continue statement
 * 
 * @param {String} [label]
 */
var continueStatement = fun.compose(
    compute.createBlock,
    statement_flow.continueStatement);

/* Flow Control Statements
 ******************************************************************************/
/**
 * If statement
 * 
 * @param test Computation of value to branch on.
 * @param consequent Statement-like computation evaluated if 'test' is a truthy
 *    value.
 * @param alternate Statement-like computation evaluated if 'test' is a falsy
 *    value.
 */
var ifStatement = fun.compose(
    compute.createBlock,
    function(test, c, a){
        return statement_flow.ifStatement(
            test,
            compute.dispatch(c),
            compute.dispatch(a));
    });

/**
 * Semantics for a switch statement.
 * 
 * @param discriminant Computation the switch is discriminating on. This is only
 *    evaluated once and the result is cached.
 * @param preCases Array of cases before the default case.
 * @param defaultCase Case to evaluate when no other cases succeed.
 * @param postCases Array of cases after the default clause.
 * 
 * @TODO: ugly
 */
var switchStatement = fun.compose(
    compute.createBlock,
    statement_flow.switchStatement);

/* Iteration Statement Semantics
 ******************************************************************************/
/**
 * While statement
 * 
 * @param [test] Loop conditional expression.
 * @param body Loop body statement.
 */
var whileStatement = fun.compose(
    compute.createBlock,
    function(test, body) {
        return statement_flow.whileStatement(
            (test || boolean.TRUE),
            compute.dispatch(body));
    });


/**
 * Do while statement
 * 
 * @param body Loop body statement.
 * @param [test] Expression giving value that stops iteration if falsy.
 */
var doWhileStatement = fun.compose(
    compute.createBlock,
    function(body, test) {
        return statement_flow.doWhileStatement(
            compute.dispatch(body),
            (test || boolean.TRUE));
    });

/**
 * For statement
 * 
 * @param init Computation executed before any iterations.
 * @param test Computation giving condition that must be satisfied to enter the
 *    loop.
 * @param update Computation executed after each iteration.
 * @param body Statement-like computation for the body of the loop.
 */
var forStatement = fun.compose(
    compute.createBlock,
    function(init, test, update, body) {
        return statement_flow.forStatement(
            (init || expression.emptyExpression()),
            (test || boolean.TRUE),
            (update || expression.emptyExpression()),
            compute.dispatch(body));
    });

/**
 * For-in statement
 * 
 * @param lhs Expression giving reference to bind on each iteration.
 * @param rhs Expression giving object to enumerate.
 * @param body Loop body statement.
 * 
 * @TODO: using an internal reference to track iteration state is pretty ugly.
 */
var forInStatement = fun.compose(
    compute.createBlock,
    function(lhs, rhs, body) {
        return statement_flow.forInStatement(
            lhs,
            rhs,
            compute.dispatch(body));
    });

/**
 * For-in statement with a var declarator on the left hand side.
 * 
 * @param {String} id Name of variable to bind on each iteration.
 * @param rhs Expression giving object to enumerate.
 * @param body Loop body statement.
 */
var forVarInStatement = fun.compose(
    compute.createBlock, 
    function(lhs, rhs, body) {
        return statement_flow.forVarInStatement(
            lhs,
            rhs,
            compute.dispatch(body));
    });

/* Error Handling Statements
 ******************************************************************************/
/**
 * Try-catch-finally statement
 * 
 * @param body Statement executed. Errors during execution are trapped and handled.
 * @param {string} handlerId Name of to bind error value to in the catch block.
 * @param handler Statement-like computation executed if 'body' fails.
 * @param finalizer Statement-like computation executed at the end of the statement,
 *    regardless of if an error occurred.
 */
var tryCatchFinallyStatement = fun.compose(
    compute.createBlock,
    function(body, handlerId, handler, finalizer) {
        return statement_flow.tryStatement(
            compute.dispatch(body),
            handlerId,
            compute.dispatch(handler),
            compute.dispatch(finalizer));
    });

/**
 * Try-catch statement
 * 
 * No finally block.
 */
var tryCatchStatement = fun.compose(
    compute.createBlock,
    function(body, handlerId, handler) {
        return statement_flow.tryStatement(
            compute.dispatch(body),
            handlerId,
            compute.dispatch(handler),
            statement_flow.emptyStatement);
    });

/**
 * Try-finally statement
 * 
 * No catch block.
 */
var tryFinallyStatement = fun.compose(
    compute.createBlock,
    function(body, finalizer) {
        return statement_flow.tryStatement(
            compute.dispatch(body),
            null,
            statement_flow.emptyStatement,
            compute.dispatch(finalizer));
    });

/* Export
 ******************************************************************************/
return {
    'statementNext': statement_flow.statementNext,
    'statementList': statement_flow.statementList,
    
// Base Statements
    'emptyStatement': emptyStatement,
    'expressionStatement': expressionStatement,
    'blockStatement': blockStatement,
    'withStatement': withStatement,
    
// Completion Statements
    'returnStatement': returnStatement,
    'throwStatement': throwStatement,
    'breakStatement': breakStatement,
    'continueStatement': continueStatement,
    
// Flow Control Statements
    'ifStatement': ifStatement,
    'switchStatement': switchStatement,
    
// Iteration Statements
    'doWhileStatement': doWhileStatement,
    'whileStatement': whileStatement,
    'forStatement': forStatement,
    'forInStatement': forInStatement,
    'forVarInStatement': forVarInStatement,

// Error Handling Statements
    'tryCatchFinallyStatement': tryCatchFinallyStatement,
    'tryCatchStatement': tryCatchStatement,
    'tryFinallyStatement': tryFinallyStatement
};

});