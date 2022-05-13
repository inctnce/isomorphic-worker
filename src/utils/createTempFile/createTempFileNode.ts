import CreateTempFile from "../../types/CreateTempFile";

export const createTempFileNode: CreateTempFile = async (data, extension = "") => {
	try {
		const fs = await import("fs/promises");
		const path = await import("path");
		const crypto = await import("crypto");

		let filename = `${crypto.randomBytes(4).readUInt32LE(0).toString()}`;
		if (extension) filename += `.${extension}`;

		await fs.writeFile(filename, data);
		return path.resolve(filename);
	} catch (error: any) {
		return error;
	}
};
