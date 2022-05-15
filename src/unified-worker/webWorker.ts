import IWorker from "../types/Worker";
import addSlashes from "../utils/addSlashes";
import createTempFile from "../utils/createTempFile/createTempFile";
import { funcToArrowFunc } from "../utils/funcToArrowFunc";
import serialization from "../utils/serialization";

export const webWorker: IWorker = async <C, A, R>(func: Function, context?: C, ...args: A[]): Promise<R> => {
	return new Promise(async (resolve, reject) => {
		const arrowFunc = funcToArrowFunc(func.toString());
		const funcArgs = args ? args.map((arg, index) => `"arg${index}"`).join(", ") : "";
		const serializedContext = context ? `serialization.parse('${addSlashes(serialization.stringify(context))}')` : {};
		const serializedArgs = args ? `serialization.parse('${addSlashes(serialization.stringify(args))}')` : undefined;

		console.log(func.toString());

		const funcWrapper = `
			const serialization = {'stringify': ${serialization.stringify.toString()}, 'parse': ${serialization.parse.toString()}};
			const func = new Function(${funcArgs}, \`return (${arrowFunc.toString()})(...args)\`);
			const context =  ${serializedContext};
			const args = ${serializedArgs};
			onmessage = (e) => postMessage(func.apply(context, args));
			`;

		const tempFilepath = await createTempFile(funcWrapper, "application/javascript");
		const worker = new Worker(tempFilepath);
		worker.onmessage = (e) => resolve(e.data);
		worker.onerror = (e) => reject(e.message);
		worker.postMessage("");
	});
};
