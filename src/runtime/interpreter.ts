import { RuntimeValue, MakeNumber, MakeString } from "./values";
import {
    AssignmentExpression,
    BinaryExpression,
    CallExpression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    MemberExpression,
    NumericLiteral,
    ObjectLiteral,
    Program,
    Statement,
    StringLiteral,
    VariableDeclaration,
} from "../front/ast";
import Environment from "./environment";
import {
    evaluateFunctionDeclaration,
    evaluateProgram,
    evaluateVariableDeclaration,
} from "./evaluate/Statements";
import {
    evaluateIdentifier,
    evaluateBinaryExpression,
    evaluateAssignment,
    evaluateObjectExpression,
    evaluateCallExpression,
    evaluateIfStatement,
} from "./evaluate/Expressions";

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return MakeNumber((astNode as NumericLiteral).value);

        case "StringLiteral":
            return MakeString((astNode as StringLiteral).value);

        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, env);

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, env);

        case "Program":
            return evaluateProgram(astNode as Program, env);

        case "VariableDeclaration":
            return evaluateVariableDeclaration(
                astNode as VariableDeclaration,
                env
            );

        case "FunctionDeclaration":
            return evaluateFunctionDeclaration(
                astNode as FunctionDeclaration,
                env
            );

        case "AssignmentExpression":
            return evaluateAssignment(astNode as AssignmentExpression, env);

        case "ObjectLiteral":
            return evaluateObjectExpression(astNode as ObjectLiteral, env);

        case "CallExpression":
            return evaluateCallExpression(astNode as CallExpression, env);

        case "IfStatement":
            return evaluateIfStatement(astNode as IfStatement, env);
        default:
            console.error(
                `Erm... What the sigma, unknown node: ${astNode.kind}`
            );
            process.exit(1);
    }
}
