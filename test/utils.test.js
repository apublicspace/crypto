const { expect } = require("chai");
const Utils = require("../index.js");
const bip39 = require("bip39");

const ExpectResponseStatusCode = ({ ok, status, message, code, data }) => {
	const result = Utils.response({ data: data });
	const parsedResult = JSON.parse(result);
	if (ok) {
		expect(parsedResult.ok).to.be.true;
	} else {
		expect(parsedResult.ok).to.be.false;
	}
	expect(parsedResult.status).to.equal(status);
	expect(parsedResult.message).to.equal(message);
	expect(parsedResult.status_code).to.equal(code);
	if (ok) {
		expect(parsedResult.data).to.equal(data);
	}
};

describe("Utils tests", () => {
	it("should respond with ok status code", () => {
		ExpectResponseStatusCode({
			ok: true,
			status: "success",
			message: "OK: successful",
			code: 200,
			data: "Test data"
		});
	});

	it("should respond with unauthorized status code", () => {
		ExpectResponseStatusCode({
			ok: false,
			status: "unauthorized",
			message: "Unauthorized: Access denied",
			code: 401,
			data: "Unauthorized: Access denied"
		});
	});

	it("should respond with error status code", () => {
		ExpectResponseStatusCode({
			ok: false,
			status: "bad request",
			message: "Bad Request: Invalid input",
			code: 400,
			data: "Error: Invalid input"
		});
	});

	it("should return english word from wordlist", () => {
		const word = Utils.wordFromNumber({ number: 42, language: "english" });
		expect(word).to.equal(bip39.wordlists.english[42]);
	});

	it("should return Japanese word from wordlist", () => {
		const word = Utils.wordFromNumber({ number: 42, language: "japanese" });
		expect(word).to.equal(bip39.wordlists.japanese[42]);
	});

	it("should return error for unsupported language", () => {
		const result = Utils.wordFromNumber({
			number: 42,
			language: "unsupported"
		});
		expect(result).to.equal("Error: language 'unsupported' not supported");
	});

	it("should return error for number out of range", () => {
		const result = Utils.wordFromNumber({ number: 3000, language: "english" });
		expect(result).to.equal("Error: number should be between 0 and 2047");
	});
});
