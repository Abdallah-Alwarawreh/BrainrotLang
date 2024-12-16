export type NodeType =
    | "Program"
    | "VariableDeclaration"
    | "FunctionDeclaration"
    | "IfStatement"
    | "AssignmentExpression"
    | "MemberExpression"
    | "CallExpression"
    | "NumericLiteral"
    | "StringLiteral"
    | "ObjectLiteral"
    | "Property"
    | "Identifier"
    | "BinaryExpression"
    | "CompareExpression";

export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration";
    constant: boolean;
    identifier: string;
    value?: Expression;
}

export interface FunctionDeclaration extends Statement {
    kind: "FunctionDeclaration";
    parameters: string[];
    name: string;
    body: Statement[];
}

export interface IfStatement extends Statement {
    kind: "IfStatement";
    condition: Expression;
    consequent: Statement[];
    alternate?: Statement[];
}

export interface Expression extends Statement {}

export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression";
    assignee: Expression;
    value: Expression;
}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
}

export interface CompareExpression extends Expression {
    kind: "CompareExpression";
    left: Expression;
    right: Expression;
    operator: string;
}

export interface CallExpression extends Expression {
    kind: "CallExpression";
    args: Expression[];
    caller: Expression;
}

export interface MemberExpression extends Expression {
    kind: "MemberExpression";
    object: Expression;
    property: Expression;
    computed: boolean;
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    value: number;
}

export interface StringLiteral extends Expression {
    kind: "StringLiteral";
    value: string;
}

export interface Property extends Expression {
    kind: "Property";
    key: string;
    value?: Expression;
}

export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral";
    properties: Property[];
}
