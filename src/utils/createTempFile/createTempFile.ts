import detectEnvironment from "../detectEnvironment";
import CreateTempFile from "../../types/CreateTempFile";

const createTempFile: CreateTempFile = (data: string, extension = "") => {
	return new Promise((resolve, reject) => {
		if (detectEnvironment() === "node")
			import("./createTempFileNode").then(({ createTempFileNode }) =>
				createTempFileNode(data, extension)
					.then((filepath) => resolve(filepath))
					.catch((err) => reject(err))
			);
		else
			import("./createTempFileWeb").then(({ createTempFileWeb }) =>
				createTempFileWeb(data, extension)
					.then((filepath) => resolve(filepath))
					.catch((err) => reject(err))
			);
	});
};

export default createTempFile;
