import {
    MakeBool,
    MakeNativeFunction,
    MakeNull,
    MakeNumber,
    RuntimeValue,
} from "./values";

export function createGlobalEnv() {
    const env = new Environment();

    env.declareVariable("nocap", MakeBool(true), true); // true
    env.declareVariable("cap", MakeBool(false), true); // false
    env.declareVariable("sus", MakeNull(), true); // null

    env.declareVariable(
        "buss",
        MakeNativeFunction((args, scope) => {
            console.log(...args);
            return MakeNull();
        }),
        true
    );

    return env;
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;

    constructor(parentEnv?: Environment) {
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVariable(
        name: string,
        value: RuntimeValue,
        constant: boolean
    ): RuntimeValue {
        if (this.variables.has(name)) {
            throw `Erm... what the sigma. Variable ${name} already exists in this scope.`;
        }

        this.variables.set(name, value);
        if (constant) this.constants.add(name);

        return value;
    }

    public assignVariable(name: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolve(name);
        if (env.constants.has(name))
            throw `Erm... what the sigma. Variable ${name} is constant.`;

        env.variables.set(name, value);

        return value;
    }

    public lookupVariable(name: string): RuntimeValue {
        const env = this.resolve(name);

        if (!env.variables.has(name)) {
            throw `Erm... what the sigma. Variable ${name} does not exist in this scope.`;
        }

        return env.variables.get(name)!;
    }

    public resolve(name: string): Environment {
        if (this.variables.has(name)) {
            return this;
        }

        if (this.parent == undefined) {
            throw `Erm... what the sigma. cannot resolve variable ${name}.`;
        }

        return this.parent.resolve(name);
    }
}
