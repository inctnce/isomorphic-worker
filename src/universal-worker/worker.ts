import detectEnvironment from "../utils/detectEnvironment";

export const createWorker = (filename: string | URL, options?: WorkerOptions) => {
	if (detectEnvironment() === "node") return createNodeWorker(filename, options);
	return createWebWorker(filename, options);
};

const createNodeWorker = async (filename: string | URL, options?: any) => {
	return new Promise((resolve, _reject) => {
		import("worker_threads").then(({ Worker }) => {
			resolve(new Worker(filename, options));
		});
	});
};

const createWebWorker = async (scriptURL: string | URL, options?: WorkerOptions) => {
	return new Promise((resolve, _reject) => {
		resolve(new Worker(scriptURL, options));
	});
};
