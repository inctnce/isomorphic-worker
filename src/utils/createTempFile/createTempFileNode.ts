import CreateTempFile from "../../types/CreateTempFile";

export const createTempFileNode: CreateTempFile = async (data, extension = "") => {
	try {
		const fs = eval("require")("fs/promises");
		const path = eval("require")("path");
		const crypto = eval("require")("crypto");

		let filename = `${crypto.randomBytes(4).readUInt32LE(0).toString()}`;
		if (extension) filename += `.${extension}`;

		await fs.writeFile(filename, data);
		return path.resolve(filename);
	} catch (error: any) {
		return error;
	}
};
