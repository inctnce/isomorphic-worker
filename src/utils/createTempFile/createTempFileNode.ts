import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import CreateTempFile from "../../types/CreateTempFile";

export const createTempFileNode: CreateTempFile = async (data, extension = "") => {
	let filename = `${crypto.randomBytes(4).readUInt32LE(0).toString()}`;
	if (extension) filename += `.${extension}`;

	await fs.writeFile(filename, data);
	return path.resolve(filename);
};
