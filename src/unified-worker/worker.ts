import Worker from "../types/Worker";
import detectEnvironment from "../utils/detectEnvironment";

export const worker: Worker = async <C, A, R>(func: Function, context?: C, args?: A): Promise<R> => {
	return new Promise((resolve, reject) => {
		if (detectEnvironment() === "node")
			import("./nodeWorker")
				.then(({ nodeWorker }) =>
					nodeWorker(func, context, args)
						.then((result: any) => resolve(result))
						.catch((err) => reject(err))
				)
				.catch((err) => reject(err));
	});
};
