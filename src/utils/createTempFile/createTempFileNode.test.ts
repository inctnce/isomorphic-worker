import fs from "fs";
import { createTempFileNode } from "./createTempFileNode";

describe("createTempFileNode", () => {
	test("Empty data", async () => {
		const filepath = await createTempFileNode("");
		expect(fs.existsSync(filepath)).toBe(true);
		fs.unlink(filepath, () => {});
	});

	test("Some data", async () => {
		const data = "absolutely meaningless string";
		const filepath = await createTempFileNode(data);
		expect(fs.existsSync(filepath)).toBe(true);
		fs.readFile(filepath, (err, fileContent) => {
			expect(fileContent.toString()).toBe(data);
		});
		fs.unlink(filepath, () => {});
	});
});
