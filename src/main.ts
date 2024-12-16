import fs from "fs";
import Parser from "./front/parser";
import { evaluate } from "./runtime/interpreter";
import { createGlobalEnv } from "./runtime/environment";

async function execute(codePath: string) {
    const parser = new Parser();
    const env = createGlobalEnv();

    const input = await fs.promises.readFile(codePath, "utf-8");
    const program = parser.ProduceAST(input);
    const result = evaluate(program, env);
    // console.log(result);
}

execute(process.argv[2]);
