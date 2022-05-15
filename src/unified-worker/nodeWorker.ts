import IWorker from "../types/Worker";
import createTempFile from "../utils/createTempFile/createTempFile";
import serialization from "../utils/serialization";
import addSlashes from "../utils/addSlashes";
import { funcToArrowFunc } from "../utils/funcToArrowFunc";

export const nodeWorker: IWorker = async <C, A, R>(func: Function, context?: C, ...args: A[]): Promise<R> => {
	return new Promise(async (resolve, reject) => {
		const { Worker } = eval("require")("worker_threads");

		const funcEnv = setupFunctionEnvironment(func, context, ...args);

		const tempFilepath = await createTempFile(funcEnv, "temp.js");

		const worker = new Worker(tempFilepath);
		worker.on("message", (result: string) => {
			resolve(serialization.parse(result));
		});
		worker.on("error", (err: string) => {
			reject(err);
		});
		worker.on("exit", async (exitCode: number) => {
			// eval("require")("fs/promises")
			// 	.unlink(tempFilepath)
			// 	.catch((err: any) => reject(err));
			reject(exitCode);
		});
	});
};

export const setupFunctionEnvironment = (func: Function, context?: any, ...args: any[]): string => {
	let wrapper = `const { parentPort } = require("worker_threads");\n`;
	wrapper += `const serialization = {'stringify': ${serialization.stringify.toString()}, 'parse': ${serialization.parse.toString()}};\n`;

	const arrowFunc = funcToArrowFunc(func.toString());
	const funcArgs = args && args.length > 0 ? args.map((_, index) => `"arg${index}"`).join(", ") + "," : "";
	const funcCallArgs = args && args.length > 0 ? args.map((_, index) => `arg${index}`).join(", ") : "";
	const serializedContext = context ? `serialization.parse('${addSlashes(serialization.stringify(context))}')` : null;
	const serializedArgs = args ? `serialization.parse('${addSlashes(serialization.stringify(args))}')` : null;

	wrapper += `const func = new Function(${funcArgs} \`return (${arrowFunc.toString()})(${funcCallArgs})\`);\n`;
	wrapper += `const context =  ${serializedContext};\n`;
	wrapper += `const args = ${serializedArgs}\n`;
	wrapper += `parentPort.postMessage(serialization.stringify(func.call(context, ...args)));`;

	return wrapper;
};
