import serialization from "./serialization";
import addSlashes from "./addSlashes";

describe("serialization", () => {
	describe("parse", () => {
		test("Object with primitives", () => {
			const objWithPrimitives = { a: 1, b: "hello", c: true };
			const stringified = serialization.stringify({ a: 1, b: "hello", c: true });
			expect(serialization.parse(stringified)).toStrictEqual(objWithPrimitives);
		});

		test("Object with regular function", () => {
			const objWithFunction = serialization.stringify({ a: 1, b: "hello", f: function () {} });
			expect(serialization.parse(objWithFunction)).toStrictEqual({ a: 1, b: "hello", f: expect.any(Function) });
		});

		test("Object with arrow function", () => {
			const objWithFunction = serialization.stringify({ a: 1, b: "hello", f: () => {} });
			expect(serialization.parse(objWithFunction)).toStrictEqual({ a: 1, b: "hello", f: expect.any(Function) });
		});

		test("Object with regular expression", () => {
			const objWithRegex = { a: 1, b: "hello", c: true, r: /^123$/ };
			const stringified = serialization.stringify({ a: 1, b: "hello", c: true, r: /^123$/ });
			expect(serialization.parse(stringified)).toStrictEqual(objWithRegex);
		});

		test("Array", () => {
			const arr = ["hello", 1, true];
			const stringified = serialization.stringify(["hello", 1, true]);
			expect(serialization.parse(stringified)).toStrictEqual(arr);
		});

		test("Empty object", () => {
			const emptyObj = {};
			const stringified = serialization.stringify(emptyObj);
			expect(serialization.parse(stringified)).toStrictEqual(emptyObj);
		});

		test("null", () => {
			expect(serialization.parse("null")).toBe(null);
		});

		test("undefined", () => {
			expect(serialization.parse("undefined")).toBe(undefined);
		});
	});

	describe("stringify", () => {
		test("Object with primitives", () => {
			const objWithPrimitives = { a: 1, b: "hello", c: true };
			expect(serialization.stringify(objWithPrimitives)).toBe(`{"a":1,"b":"hello","c":true}`);
		});

		test("Object with regular function", () => {
			const objWithFunction = { a: 1, b: "hello", c: true, f: function () {} };
			expect(serialization.stringify(objWithFunction)).toBe(
				`{"a":1,"b":"hello","c":true,"f":"__func__:function () { }"}`
			);
		});

		test("Object with arrow function", () => {
			const objWithFunction = { a: 1, b: "hello", c: true, f: () => {} };
			expect(serialization.stringify(objWithFunction)).toBe(`{"a":1,"b":"hello","c":true,"f":"__func__:() => { }"}`);
		});

		test("Object with regular expression", () => {
			const objWithRegex = { a: 1, b: "hello", c: true, r: /^123$/ };
			expect(serialization.stringify(objWithRegex)).toBe(`{"a":1,"b":"hello","c":true,"r":"__regex__:/^123$/"}`);
		});

		test("Array", () => {
			const arr = ["hello", 1, 2, true];
			expect(serialization.stringify(arr)).toBe(`["hello",1,2,true]`);
		});

		test("Empty object", () => {
			expect(serialization.stringify({})).toBe("{}");
		});

		test("null", () => {
			expect(serialization.stringify(null)).toBe("null");
		});

		test("undefined", () => {
			expect(serialization.stringify(undefined)).toBe(undefined);
		});
	});
});
