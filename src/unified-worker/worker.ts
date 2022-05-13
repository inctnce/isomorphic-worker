import Worker from "../types/Worker";
import detectEnvironment from "../utils/detectEnvironment";

export const worker: Worker = async <C, A, R>(func: Function, context?: C, args?: A): Promise<R> => {
	if (detectEnvironment() === "node") {
		const { nodeWorker } = await import("./nodeWorker");
		return await nodeWorker(func, context, args);
	}

	const { webWorker } = await import("./webWorker");
	return await webWorker(func, context, args);
};
