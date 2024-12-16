import {
    Statement,
    Program,
    Expression,
    BinaryExpression,
    NumericLiteral,
    Identifier,
    VariableDeclaration,
    FunctionDeclaration,
    AssignmentExpression,
    Property,
    ObjectLiteral,
    CallExpression,
    MemberExpression,
    StringLiteral,
    IfStatement,
    CompareExpression,
} from "./ast";
import { Tokenize, Token, TokenType } from "./lexer";

export default class Parser {
    private Tokens: Token[] = [];

    private not_eof(): boolean {
        return this.Tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.Tokens[0];
    }

    private eat() {
        return this.Tokens.shift() as Token;
    }

    private expect(type: TokenType, error: any) {
        const prev = this.eat();

        if (prev.type != type) {
            console.error(
                "Erm... What the sigma, " + error,
                this.at(),
                "Expected: ",
                type
            );
            process.exit(1);
        }

        return prev;
    }

    public ProduceAST(SourceCode: string): Program {
        this.Tokens = Tokenize(SourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.not_eof()) {
            program.body.push(this.ParseStatement());
        }

        return program;
    }

    private ParseStatement(): Statement {
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.ParseVariableDeclaration();
            case TokenType.Fn:
                return this.ParseFunctionDeclaration();
            case TokenType.If:
                return this.ParseIfStatement();
            default:
                return this.ParseExpression();
        }
    }

    private ParseIfStatement(): Statement {
        // if (a > b) {
        // statements to run
        // }

        this.eat(); // eat the 'if' token
        this.expect(TokenType.OpenParen, "if, expected (");
        let condition = this.ParseExpression();

        this.expect(TokenType.CloseParen, "if, expected )");

        const consequent: Statement[] = [];

        this.expect(TokenType.OpenBrace, "if, expected {");

        while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
            consequent.push(this.ParseStatement());
        }

        this.expect(TokenType.CloseBrace, "Erm... what the sigma, expected }");

        let alternate: Statement[] = [];
        if (this.at().type == TokenType.Else) {
            this.eat(); // eat the 'else' token

            if (this.at().type == TokenType.If) {
                alternate.push(this.ParseIfStatement());
                return {
                    kind: "IfStatement",
                    condition,
                    consequent,
                    alternate,
                } as IfStatement;
            }

            this.expect(TokenType.OpenBrace, "else, expected {");

            while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
                alternate.push(this.ParseStatement());
            }

            this.expect(
                TokenType.CloseBrace,
                "Erm... what the sigma, expected }"
            );
        }

        return {
            kind: "IfStatement",
            condition,
            consequent,
            alternate,
        } as IfStatement;
    }

    private ParseFunctionDeclaration(): Statement {
        this.eat();
        const name = this.expect(
            TokenType.Identifier,
            "Erm... what the sigma, expected a function name"
        ).value;

        const args = this.ParseArgs();
        const params = [];
        for (const arg of args) {
            if (arg.kind !== "Identifier")
                throw "Erm... what the sigma, expected parameter to be of type string";

            params.push((arg as Identifier).symbol);
        }

        this.expect(TokenType.OpenBrace, "Erm... what the sigma, expected {");

        const body: Statement[] = [];

        while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
            body.push(this.ParseStatement());
        }

        this.expect(TokenType.CloseBrace, "Erm... what the sigma, expected }");

        const fn = {
            kind: "FunctionDeclaration",
            body,
            name,
            parameters: params,
        } as FunctionDeclaration;

        return fn;
    }

    private ParseVariableDeclaration(): Statement {
        const isConst = this.eat().type == TokenType.Const;
        const identifier = this.expect(
            TokenType.Identifier,
            "Expected identifier to follow"
        ).value;

        if (this.at().type == TokenType.SemiColon) {
            this.eat();

            if (isConst) {
                throw `Erm... what the sigma. Const variable ${identifier} must be initialized.`;
            }

            return {
                kind: "VariableDeclaration",
                identifier,
                constant: false,
            } as VariableDeclaration;
        }

        this.expect(TokenType.Equals, "Erm... What the sigma, expected '='");
        const declaration = {
            kind: "VariableDeclaration",
            value: this.ParseExpression(),
            constant: isConst,
            identifier,
        } as VariableDeclaration;

        this.expect(TokenType.SemiColon, "Erm... What the sigma, expected ';'");
        return declaration;
    }

    private ParseExpression(): Expression {
        return this.ParseAssignmentExpression();
    }

    private ParseAssignmentExpression(): Expression {
        const left = this.ParseObjectExpression();

        if (this.at().type == TokenType.Equals) {
            this.eat();

            const value = this.ParseAssignmentExpression();
            return {
                value,
                assignee: left,
                kind: "AssignmentExpression",
            } as AssignmentExpression;
        }

        return left;
    }

    private ParseObjectExpression(): Expression {
        if (this.at().type !== TokenType.OpenBrace) {
            return this.ParseCompareExpression();
        }

        this.eat();
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
            const key = this.expect(
                TokenType.Identifier,
                "Erm... what the sigma, Object key expected"
            ).value;

            if (this.at().type == TokenType.Comma) {
                this.eat();

                properties.push({
                    kind: "Property",
                    key: key,
                } as Property);

                continue;
            } else if (this.at().type == TokenType.CloseBrace) {
                properties.push({
                    kind: "Property",
                    key: key,
                } as Property);
                continue;
            }

            this.expect(TokenType.Colon, "Erm... what the sigma, expected :");
            const value = this.ParseExpression();

            properties.push({
                kind: "Property",
                key,
                value,
            } as Property);

            if (this.at().type !== TokenType.CloseBrace) {
                this.expect(
                    TokenType.Comma,
                    "Erm... what the sigma, expected , or ]"
                );
            }
        }

        this.expect(
            TokenType.CloseBrace,
            "Erm... what the sigma, missing closing brace"
        );

        return {
            kind: "ObjectLiteral",
            properties,
        } as ObjectLiteral;
    }

    private ParseCompareExpression(): Expression {
        let left = this.ParseAdditiveExpression();

        while (
            this.at().value == "<" ||
            this.at().value == ">" ||
            this.at().value == "<=" ||
            this.at().value == ">=" ||
            this.at().value == "==" ||
            this.at().value == "!="
        ) {
            const operator = this.eat().value;
            const right = this.ParseAdditiveExpression();
            left = {
                kind: "CompareExpression",
                left,
                right,
                operator: operator,
            } as CompareExpression;
        }

        return left;
    }

    private ParseAdditiveExpression(): Expression {
        let left = this.ParseMultiplicativeExpression();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.ParseMultiplicativeExpression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator: operator,
            } as BinaryExpression;
        }

        return left;
    }

    private ParseMultiplicativeExpression(): Expression {
        let left = this.ParseCallMemberExpression();

        while (
            this.at().value == "*" ||
            this.at().value == "/" ||
            this.at().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.ParseCallMemberExpression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator: operator,
            } as BinaryExpression;
        }

        return left;
    }

    private ParseCallMemberExpression(): Expression {
        const member = this.ParseMemberExpression();

        if (this.at().type == TokenType.OpenParen) {
            return this.ParseCallExpression(member);
        }

        return member;
    }

    private ParseCallExpression(caller: Expression): Expression {
        let callExpression: Expression = {
            kind: "CallExpression",
            caller,
            args: this.ParseArgs(),
        } as CallExpression;

        if (this.at().type == TokenType.OpenParen) {
            callExpression = this.ParseCallExpression(callExpression);
        }

        return callExpression;
    }

    private ParseArgs(): Expression[] {
        this.expect(TokenType.OpenParen, "Erm... what the sigma, expected (");
        const args =
            this.at().type == TokenType.CloseParen ? [] : this.ParseArgsList();

        this.expect(TokenType.CloseParen, "Erm... what the sigma, expected )");
        return args;
    }

    private ParseArgsList(): Expression[] {
        const args = [this.ParseAssignmentExpression()];

        while (this.at().type == TokenType.Comma && this.eat()) {
            args.push(this.ParseAssignmentExpression());
        }

        return args;
    }

    private ParseMemberExpression(): Expression {
        let object: any = this.ParsePrimaryExpression();

        while (
            this.at().type == TokenType.Dot ||
            this.at().type == TokenType.OpenBracket
        ) {
            const operator = this.eat();
            let property: Expression;
            let computed: boolean;

            if (operator.type == TokenType.Dot) {
                computed = false;
                property = this.ParsePrimaryExpression();

                if (property.kind != "Identifier")
                    throw `Erm... what the sigma, expected an identifier`;
            } else {
                computed = true;
                property = this.ParseExpression();
                this.expect(
                    TokenType.CloseBracket,
                    "Erm... what the sigma, expected a ]"
                );
            }

            object = {
                kind: "MemberExpression",
                object,
                property,
                computed,
            } as MemberExpression;
        }

        return object;
    }

    private ParsePrimaryExpression(): Expression {
        const token = this.at().type;

        switch (token) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.eat().value,
                } as Identifier;

            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value),
                } as NumericLiteral;

            case TokenType.String:
                return {
                    kind: "StringLiteral",
                    value: this.eat().value,
                } as StringLiteral;

            case TokenType.OpenParen:
                this.eat();
                const value = this.ParseExpression();
                this.expect(
                    TokenType.CloseParen,
                    "Erm... What the sigma, expected ')'"
                );
                return value;

            default:
                console.error(
                    `Erm... What the sigma, unknown token: ${TokenType[token]}`
                );
                process.exit(1);
        }
    }
}
