const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
const isNode = new Function("try {return this===global;}catch(e){return false;}");

const detectEnvironment = (): "browser" | "node" => {
	if (isBrowser()) return "browser";
	return "node";
};

export default detectEnvironment;