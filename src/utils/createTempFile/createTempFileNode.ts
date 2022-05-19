
import CreateTempFile from "../../types/CreateTempFile";

export const createTempFileNode: CreateTempFile = async (data, extension = "") => {
	return new Promise((resolve, reject) =>{
		const fs = eval("require")("fs");
		const path = eval("require")("path");
		const crypto = eval("require")("crypto");

		let filename = `${crypto.randomBytes(4).readUInt32LE(0).toString()}`;
		if (extension) filename += `.${extension}`;

		fs.writeFile(filename, data, (err: string) => {
			if (err) reject(err)
			resolve(path.resolve(filename))
		});
	})
};
