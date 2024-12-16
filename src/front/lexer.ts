export enum TokenType {
    String,
    Number,
    Identifier,

    Equals,

    LT, // <
    GT, // >
    Eq, // ==
    NotEq, // !=
    LTEq, // <=
    GTEq, // >=

    Comma, // ,
    Colon, // :
    Dot, // .
    SemiColon, // ;
    // ()
    OpenParen, // (
    CloseParen, // )
    // {}
    OpenBrace, // {
    CloseBrace, // }
    // []
    OpenBracket, // [
    CloseBracket, // ]
    BinaryOperator,

    Let,
    Const,
    Fn,
    If,
    Else,

    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    skibidi: TokenType.Let,
    grimace: TokenType.Const,
    pluh: TokenType.Fn,
    fanum: TokenType.If,
    tax: TokenType.Else,
};

export interface Token {
    value: string;
    type: TokenType;
}

function Token(value: string = "", type: TokenType): Token {
    return { value, type };
}

function isAlpha(char: string): boolean {
    return char.toUpperCase() != char.toLowerCase();
}

function isInteger(char: string): boolean {
    const c = char.charCodeAt(0);
    return c >= 48 && c <= 57;
}

function isWhitespace(char: string): boolean {
    return char == " " || char == "\t" || char == "\n" || char == "\r";
}

export function Tokenize(SourceCode: string): Token[] {
    const tokens: Token[] = [];
    const srcChars: string[] = SourceCode.split("");

    function lookAhead(): string {
        return srcChars.length > 1 ? srcChars[1] : "";
    }

    while (srcChars.length > 0) {
        // build shit
        // fuck performance

        if (srcChars[0] == "(")
            tokens.push(Token(srcChars.shift(), TokenType.OpenParen));
        else if (srcChars[0] == ")")
            tokens.push(Token(srcChars.shift(), TokenType.CloseParen));
        else if (srcChars[0] == "{")
            tokens.push(Token(srcChars.shift(), TokenType.OpenBrace));
        else if (srcChars[0] == "}")
            tokens.push(Token(srcChars.shift(), TokenType.CloseBrace));
        else if (srcChars[0] == "[")
            tokens.push(Token(srcChars.shift(), TokenType.OpenBracket));
        else if (srcChars[0] == "]")
            tokens.push(Token(srcChars.shift(), TokenType.CloseBracket));
        else if (
            srcChars[0] == "+" ||
            srcChars[0] == "-" ||
            srcChars[0] == "*" ||
            srcChars[0] == "/" ||
            srcChars[0] == "%"
        )
            tokens.push(Token(srcChars.shift(), TokenType.BinaryOperator));
        else if (srcChars[0] == "=")
            if (lookAhead() == "=")
                tokens.push(
                    Token(
                        `${srcChars.shift()}${srcChars.shift()}`,
                        TokenType.Eq
                    )
                );
            else tokens.push(Token(srcChars.shift(), TokenType.Equals));
        else if (srcChars[0] == "<")
            if (lookAhead() == "=")
                tokens.push(
                    Token(
                        `${srcChars.shift()}${srcChars.shift()}`,
                        TokenType.LTEq
                    )
                );
            else tokens.push(Token(srcChars.shift(), TokenType.LT));
        else if (srcChars[0] == "!")
            if (lookAhead() == "=")
                tokens.push(
                    Token(
                        `${srcChars.shift()}${srcChars.shift()}`,
                        TokenType.NotEq
                    )
                );
            else {
                console.error(
                    `Erm... What the sigma, unknown character: ${srcChars[0]}`
                );
                process.exit(1);
            }
        else if (srcChars[0] == ">")
            if (lookAhead() == "=")
                tokens.push(
                    Token(
                        `${srcChars.shift()}${srcChars.shift()}`,
                        TokenType.GTEq
                    )
                );
            else tokens.push(Token(srcChars.shift(), TokenType.GT));
        else if (srcChars[0] == ";")
            tokens.push(Token(srcChars.shift(), TokenType.SemiColon));
        else if (srcChars[0] == ":")
            tokens.push(Token(srcChars.shift(), TokenType.Colon));
        else if (srcChars[0] == ",")
            tokens.push(Token(srcChars.shift(), TokenType.Comma));
        else if (srcChars[0] == ".")
            tokens.push(Token(srcChars.shift(), TokenType.Dot));
        else {
            if (isInteger(srcChars[0])) {
                let num = "";

                while (srcChars.length > 0) {
                    // handles decimals
                    if (srcChars[0] == ".") {
                        num += srcChars.shift();
                        while (srcChars.length > 0 && isInteger(srcChars[0])) {
                            num += srcChars.shift();
                        }
                        break;
                    } else if (!isInteger(srcChars[0])) break;
                    num += srcChars.shift();
                }

                tokens.push(Token(num, TokenType.Number));
            } else if (srcChars[0] == `"`) {
                let str = "";
                srcChars.shift();

                while (srcChars.length > 0 && srcChars[0] != `"`) {
                    str += srcChars.shift();
                }

                srcChars.shift();
                tokens.push(Token(str, TokenType.String));
            } else if (isAlpha(srcChars[0])) {
                let iden = "";

                while (srcChars.length > 0 && isAlpha(srcChars[0])) {
                    iden += srcChars.shift();
                }

                if (typeof KEYWORDS[iden] == "number") {
                    tokens.push(Token(iden, KEYWORDS[iden]));
                } else {
                    tokens.push(Token(iden, TokenType.Identifier));
                }
            } else if (isWhitespace(srcChars[0])) {
                srcChars.shift();
            } else {
                console.error(
                    `Erm... What the sigma, unknown character: ${srcChars[0]}`
                );
                process.exit(1);
            }
        }
    }

    tokens.push({ type: TokenType.EOF, value: "EOF" });

    return tokens;
}
