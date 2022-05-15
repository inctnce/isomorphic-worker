import { nodeWorker } from "./nodeWorker";

describe("nodeWorker", () => {
	describe("Regular function", () => {
		test("Function with no args and context", async () => {
			function noArgsNoContext() {
				return "value";
			}

			const res = await nodeWorker(noArgsNoContext, null);

			expect(res).toBe("value");
		});

		test("Function with context, no args", async () => {
			function withContextNoArgs(this: any) {
				return this;
			}

			const context = { context: "a", f: function () {} };
			const res = await nodeWorker(withContextNoArgs, context);

			expect(res).toStrictEqual({ context: "a", f: expect.any(Function) });
		});

		test("Function with args, no context", async () => {
			function withArgsNoContext(arg1: string, arg2: string) {
				return [arg1, arg2];
			}

			const res = await nodeWorker(withArgsNoContext, null, "arg1", "arg2");
			expect(res).toStrictEqual(["arg1", "arg2"]);
		});

		test("Function context and args", async () => {
			function withArgsNoContext(this: any, arg1: string, arg2: string) {
				return [this, arg1, arg2];
			}

			const context = { context: "a", arrow: function a() {} };
			const res = await nodeWorker(withArgsNoContext, context, "arg1", "arg2");

			expect(res).toStrictEqual([{ context: "a", arrow: expect.any(Function) }, "arg1", "arg2"]);
		});
	});

	describe("Arrow function", () => {});
});
