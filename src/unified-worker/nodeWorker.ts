import IWorker from "../types/Worker";
import createTempFile from "../utils/createTempFile/createTempFile";
import serialization from "../utils/serialization";
import addSlashes from "../utils/addSlashes";

export const nodeWorker: IWorker = async <C, A, R>(func: Function, context: C, ...args: A[]): Promise<R> => {
	return new Promise(async (resolve, reject) => {
		const { Worker } = eval("require")("worker_threads");

		const serializedContext = context ? `serialization.parse('${addSlashes(serialization.stringify(context))}')` : {};
		const serializedArgs = args ? `serialization.parse('${addSlashes(serialization.stringify(args))}')` : undefined;

		const funcWrapper = `
		const { parentPort } = require("worker_threads");
		const serialization = {'stringify': ${serialization.stringify.toString()}, 'parse': ${serialization.parse.toString()}};
		const func = new Function("args", \`return (${func.toString()})(args)\`);
		const context =  ${serializedContext};
		const args = ${serializedArgs};
		parentPort.postMessage(func.call(context, args));`;

		const tempFilepath = await createTempFile(funcWrapper, "js");

		const worker = new Worker(tempFilepath);
		worker.on("message", (result: R) => {
			resolve(result);
		});
		worker.on("error", (err: string) => {
			reject(err);
		});
		worker.on("exit", async (exitCode: number) => {
			eval("require")("fs/promises")
				.unlink(tempFilepath)
				.catch((err: any) => reject(err));
			reject(exitCode);
		});
	});
};
