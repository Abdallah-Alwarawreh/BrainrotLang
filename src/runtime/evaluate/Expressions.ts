import {
    ValueType,
    RuntimeValue,
    NumberValue,
    NullValue,
    MakeNull,
    MakeNumber,
    ObjectValue,
    NativeFunctionValue,
    FunctionValue,
    StringValue,
    BoolValue,
} from "../values";
import {
    AssignmentExpression,
    BinaryExpression,
    CallExpression,
    CompareExpression,
    Identifier,
    IfStatement,
    MemberExpression,
    NodeType,
    NumericLiteral,
    ObjectLiteral,
    Program,
    Statement,
    VariableDeclaration,
} from "../../front/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";

function evaluateNumericBinaryExpression(
    operator: string,
    lhs: NumberValue,
    rhs: NumberValue
): NumberValue {
    let result: number;

    switch (operator) {
        case "+":
            result = lhs.value + rhs.value;
            break;

        case "-":
            result = lhs.value - rhs.value;
            break;

        case "*":
            result = lhs.value * rhs.value;
            break;

        case "/":
            result = lhs.value / rhs.value;
            break;

        case "%":
            result = lhs.value % rhs.value;
            break;

        default:
            console.error(
                `Erm... What the sigma, unknown operator: ${operator}`
            );
            process.exit(1);
    }

    return MakeNumber(result);
}

export function evaluateBinaryExpression(
    binop: BinaryExpression,
    env: Environment
): RuntimeValue {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (lhs.type === "number" && rhs.type === "number") {
        return evaluateNumericBinaryExpression(
            binop.operator,
            lhs as NumberValue,
            rhs as NumberValue
        );
    } else if (
        lhs.type === "string" &&
        lhs.type === "string" &&
        binop.operator == "+"
    ) {
        return {
            type: "string",
            value: (lhs as StringValue).value + (rhs as StringValue).value,
        } as StringValue;
    }

    return MakeNull();
}

export function evaluateIdentifier(
    ident: Identifier,
    env: Environment
): RuntimeValue {
    return env.lookupVariable(ident.symbol);
}

export function evaluateAssignment(
    node: AssignmentExpression,
    env: Environment
): RuntimeValue {
    if (node.assignee.kind !== "Identifier") {
        throw `Erm... what the sigma, invalid lhs inside the assignment expression ${JSON.stringify(
            node.assignee
        )}`;
    }

    const variableName = (node.assignee as Identifier).symbol;
    return env.assignVariable(variableName, evaluate(node.value, env));
}

export function evaluateObjectExpression(
    obj: ObjectLiteral,
    env: Environment
): RuntimeValue {
    const object = { type: "object", properties: new Map() } as ObjectValue;

    for (const { key, value } of obj.properties) {
        const runtimeVal =
            value === undefined
                ? env.lookupVariable(key)
                : evaluate(value, env);

        object.properties.set(key, runtimeVal);
    }

    return object;
}

export function evaluateCallExpression(
    expression: CallExpression,
    env: Environment
): RuntimeValue {
    const args: RuntimeValue[] = expression.args.map((arg) => {
        return evaluate(arg, env);
    });
    const fn = evaluate(expression.caller, env);

    if (fn.type == "native-function") {
        return (fn as NativeFunctionValue).call(args, env);
    }

    if (fn.type == "function") {
        const func = fn as FunctionValue;
        const scope = new Environment(func.declarationEnvironment);

        for (let i = 0; i < func.parameters.length; i++) {
            scope.declareVariable(func.parameters[i], args[i], false);
        }

        let result: RuntimeValue = MakeNull();
        for (const statement of func.body) {
            result = evaluate(statement, scope);
        }

        return result;
    }

    throw "Erm... what the sigma, couldn't call a value that isnt a function";
}

const AllowedCompareOperators = ["<", ">", "<=", ">=", "==", "!="];

export function evaluateIfStatement(
    node: IfStatement,
    env: Environment
): RuntimeValue {
    let res: boolean = false;

    let lhs = evaluate((node.condition as CompareExpression).left, env);
    let rhs = evaluate((node.condition as CompareExpression).right, env);
    let operator = (node.condition as CompareExpression).operator;

    if (!AllowedCompareOperators.includes(operator)) {
        throw `Erm... what the sigma, invalid operator in compare expression: ${operator}`;
    }

    if (lhs.type == "number" && rhs.type == "number") {
        res = eval(
            `${(lhs as NumberValue).value} ${operator} ${
                (rhs as NumberValue).value
            }`
        );
    } else if (lhs.type == "string" && rhs.type == "string") {
        res = eval(
            `"${(lhs as StringValue).value}" ${operator} "${
                (rhs as StringValue).value
            }"`
        );
    } else if (lhs.type == "boolean" && rhs.type == "boolean") {
        res
            ? (res = (lhs as BoolValue).value === (rhs as BoolValue).value)
            : (res = (lhs as BoolValue).value !== (rhs as BoolValue).value);
    } else {
        throw `Erm... what the sigma, invalid types in compare expression: ${lhs.type} and ${rhs.type}`;
    }

    if (res) {
        for (const statement of node.consequent) {
            evaluate(statement, env);
        }
    } else if (node.alternate) {
        for (const statement of node.alternate) {
            evaluate(statement, env);
        }
    }

    return MakeNull();
}
