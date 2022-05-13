import CreateTempFile from "../../types/CreateTempFile";

export const createTempFileWeb: CreateTempFile = async (data, extension = ""): Promise<string> => {
	try {
		const blob = new Blob([data], { type: extension });
		return window.URL.createObjectURL(blob);
	} catch (error: any) {
		return error;
	}
};
