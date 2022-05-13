import detectEnvironment from "../detectEnvironment";
import CreateTempFile from "../../types/CreateTempFile";

const createTempFile: CreateTempFile = (data: string, extension = "") => {
	return new Promise(async (resolve, reject) => {
		if (detectEnvironment() === "node") {
			const { createTempFileNode } = await import("./createTempFileNode");
			resolve(await createTempFileNode(data, extension));
		}

		const { createTempFileWeb } = await import("./createTempFileWeb");
		resolve(await createTempFileWeb(data, extension));
	});
};

export default createTempFile;
