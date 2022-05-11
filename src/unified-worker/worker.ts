import detectEnvironment from "../utils/detectEnvironment";

export const worker = async <T>(func: Function, context: any, funcArgs: any[]): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (detectEnvironment() === "node")
			import("./nodeWorker")
				.then(({ nodeWorker }) =>
					nodeWorker(func, context, funcArgs)
						.then((result: any) => resolve(result))
						.catch((err) => reject(err))
				)
				.catch((err) => reject(err));
	});
};
