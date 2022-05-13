const addSlashes = (str: string) => str.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");

export default addSlashes;
