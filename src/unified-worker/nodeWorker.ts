import fs from "fs/promises";
import crypto from "crypto";
import path from "path";

const serialization = {
	stringify: function (obj: any) {
		return JSON.stringify(obj, function (key, value) {
			if (value instanceof Function || typeof value == "function") return "__func__:" + value.toString();
			if (value instanceof RegExp) return "__regex__:" + value;
			return value;
		});
	},
	parse: function (str: string) {
		return JSON.parse(str, function (key, value) {
			if (typeof value != "string") return value;
			if (value.lastIndexOf("__func__:", 0) === 0) return eval("(" + value.slice(9) + ")");
			if (value.lastIndexOf("__regex__:", 0) === 0) return eval("(" + value.slice(10) + ")");
			return value;
		});
	},
};

const addSlashes = (str: string) => str.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");

export const nodeWorker = async (func: Function, context: any, funcArgs: any[]) => {
	return new Promise((resolve, reject) => {
		import("worker_threads").then(async ({ Worker }) => {
			const funcWrapper = `
			const { parentPort } = require("worker_threads");

			const serialization = {'stringify': ${serialization.stringify.toString()}, 'parse': ${serialization.parse.toString()}};

			const func = new Function("args", \`return (${func.toString()})(args)\`);
			const context =  serialization.parse('${addSlashes(serialization.stringify(context))}');
			const args = serialization.parse('${addSlashes(serialization.stringify(funcArgs))}');

			parentPort.postMessage(func.call(context, args));`;

			const tempFilepath = await createTempFile(funcWrapper);

			const worker = new Worker(tempFilepath);
			worker.on("message", (result) => {
				resolve(result);
			});
			worker.on("error", (err) => {
				reject(err);
			});
			worker.on("exit", (exitCode) => {
				fs.unlink(tempFilepath).catch((err) => reject(err));
				reject(exitCode);
			});
		});
	});
};

const createTempFile = async (dataToWrite: string, dir: string = __dirname, extension = "js") => {
	const filename = `${crypto.randomBytes(4).readUInt32LE(0).toString()}.${extension}`;
	await fs.writeFile(path.join(dir, filename), dataToWrite);
	return path.resolve(dir, filename);
};
