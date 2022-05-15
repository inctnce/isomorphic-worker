import { funcToArrowFunc } from "./funcToArrowFunc";

describe("funcToArrowFunc", () => {
	test("Function without arguments", () => {
		expect(funcToArrowFunc("function f1() {}")).toBe("()=> {}");
	});

	test("Function without arguments, with body", () => {
		expect(funcToArrowFunc('function f1() { console.log("hello") }')).toBe('()=> { console.log("hello") }');
	});

	test("Function with arguments", () => {
		expect(funcToArrowFunc("function f1(arg1, arg2) {}")).toBe("(arg1, arg2)=> {}");
	});

	test("Function with arguments and body", () => {
		expect(funcToArrowFunc('function f1(arg1, arg2) { console.log("hello") }')).toBe(
			'(arg1, arg2)=> { console.log("hello") }'
		);
	});

	test("Function with inner function definition", () => {
		expect(funcToArrowFunc("function f1 () { function f2() }")).toBe("()=> { function f2() }");
	});

	test("Function with inner function execution", () => {
		expect(funcToArrowFunc("function f1 () { f2() }")).toBe("()=> { f2() }");
	});

	test("Named arrow function", () => {
		expect(funcToArrowFunc("() => {}")).toBe("() => {}");
	});
});
