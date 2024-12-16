import { Statement } from "../front/ast";
import Environment from "./environment";

export type ValueType =
    | "null"
    | "number"
    | "string"
    | "boolean"
    | "object"
    | "native-function"
    | "function";

export interface RuntimeValue {
    type: ValueType;
}

export interface NullValue extends RuntimeValue {
    type: "null";
    value: null;
}

export function MakeNull(): NullValue {
    return {
        type: "null",
        value: null,
    } as NullValue;
}

export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
}

export function MakeNumber(num: number = 0): NumberValue {
    return {
        type: "number",
        value: num,
    } as NumberValue;
}

export interface StringValue extends RuntimeValue {
    type: "string";
    value: string;
}

export function MakeString(str: string = ""): StringValue {
    return {
        type: "string",
        value: str,
    } as StringValue;
}

MakeString;

export interface BoolValue extends RuntimeValue {
    type: "boolean";
    value: boolean;
}

export function MakeBool(bool: boolean = true): BoolValue {
    return {
        type: "boolean",
        value: bool,
    } as BoolValue;
}

export interface ObjectValue extends RuntimeValue {
    type: "object";
    properties: Map<string, RuntimeValue>;
}

export type FunctionCall = (
    args: RuntimeValue[],
    env: Environment
) => RuntimeValue;

export interface NativeFunctionValue extends RuntimeValue {
    type: "native-function";
    call: FunctionCall;
}

export function MakeNativeFunction(call: FunctionCall) {
    return {
        type: "native-function",
        call,
    } as NativeFunctionValue;
}

export interface FunctionValue extends RuntimeValue {
    type: "function";
    name: string;
    parameters: string[];
    declarationEnvironment: Environment;
    body: Statement[];
}
