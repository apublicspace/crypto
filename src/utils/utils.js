const bip39 = require("bip39");

class ResponseStatusCodes {
	static ok(data) {
		const response = {};
		response.ok = true;
		response.status = "success";
		response.message = "OK: successful";
		response.status_code = 200;
		response.data = data;
		return JSON.stringify(response);
	}

	static unauthorized(message) {
		const response = {};
		response.ok = false;
		response.status = "unauthorized";
		response.message = `Unauthorized: ${message}`;
		response.status_code = 401;
		return JSON.stringify(response);
	}

	static error(message) {
		const response = {};
		response.ok = false;
		response.status = "bad request";
		response.message = `Bad Request: ${message}`;
		response.status_code = 400;
		return JSON.stringify(response);
	}
}

function response({ data }) {
	if (data) {
		if (typeof data === "string" && data.includes("Unauthorized: ")) {
			return ResponseStatusCodes.unauthorized(
				data.replace("Unauthorized: ", "")
			);
		}
		if (typeof data === "string" && data.includes("Error: ")) {
			return ResponseStatusCodes.error(data.replace("Error: ", ""));
		}
		return ResponseStatusCodes.ok(data);
	}
	return ResponseStatusCodes.error("Bad Request: operation failed");
}

function wordFromNumber({ number, language }) {
	const wordlists = bip39.wordlists;
	const wordlist = wordlists[language];

	if (!wordlist) {
		return `Error: language '${language}' not supported`;
	}

	if (number < 0 || number >= wordlist.length) {
		return "Error: number should be between 0 and 2047";
	}

	return wordlist[number];
}

module.exports = { response, wordFromNumber };
