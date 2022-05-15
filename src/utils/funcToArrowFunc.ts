export const funcToArrowFunc = (func: string): string =>
	func.replace(/function[\w\s]*\([\w\s,]*\)/, (match) => match.slice(match.indexOf("(")) + "=>");