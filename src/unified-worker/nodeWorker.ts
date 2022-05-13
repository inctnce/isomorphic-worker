import Worker from "../types/Worker";
import createTempFile from "../utils/createTempFile/createTempFile";
import serialization from "../utils/serialization";
import addSlashes from "../utils/addSlashes";

export const nodeWorker: Worker = async <C, A, R>(func: Function, context?: C, args?: A): Promise<R> => {
	return new Promise(async (resolve, reject) => {
		try {
			const { Worker } = await import("worker_threads");
			const funcWrapper = `
			const { parentPort } = require("worker_threads");
			const serialization = {'stringify': ${serialization.stringify.toString()}, 'parse': ${serialization.parse.toString()}};
			const func = new Function("args", \`return (${func.toString()})(args)\`);
			const context =  serialization.parse('${addSlashes(serialization.stringify(context))}');
			const args = serialization.parse('${addSlashes(serialization.stringify(args))}');
			parentPort.postMessage(func.call(context, args));`;

			const tempFilepath = await createTempFile(funcWrapper, "js");

			const worker = new Worker(tempFilepath);
			worker.on("message", (result) => {
				resolve(result);
			});
			worker.on("error", (err) => {
				reject(err);
			});
			worker.on("exit", async (exitCode) => {
				const fs = await import("fs/promises");
				fs.unlink(tempFilepath).catch((err) => reject(err));
				reject(exitCode);
			});
		} catch (error) {
			reject(error);
		}
	});
};
