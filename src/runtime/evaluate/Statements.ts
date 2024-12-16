import {
    ValueType,
    RuntimeValue,
    NumberValue,
    NullValue,
    MakeNull,
    MakeNumber,
    FunctionValue,
} from "../values";
import {
    BinaryExpression,
    FunctionDeclaration,
    Identifier,
    NodeType,
    NumericLiteral,
    Program,
    Statement,
    VariableDeclaration,
} from "../../front/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";

export function evaluateProgram(
    program: Program,
    env: Environment
): RuntimeValue {
    let lastEvaluated: RuntimeValue = MakeNull();

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

export function evaluateVariableDeclaration(
    varDecl: VariableDeclaration,
    env: Environment
): RuntimeValue {
    const value = varDecl.value ? evaluate(varDecl.value, env) : MakeNull();
    return env.declareVariable(varDecl.identifier, value, varDecl.constant);
}

export function evaluateFunctionDeclaration(
    fnDecl: FunctionDeclaration,
    env: Environment
): RuntimeValue {
    const fn = {
        type: "function",
        name: fnDecl.name,
        parameters: fnDecl.parameters,
        declarationEnvironment: env,
        body: fnDecl.body,
    } as FunctionValue;

    return env.declareVariable(fnDecl.name, fn, true);
}
