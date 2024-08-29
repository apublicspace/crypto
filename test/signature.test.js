const { expect } = require("chai");
const Signature = require("../index.js");
const Keys = require("../index.js");

const expectSignMessage = ({ signedMessage, message, keypair }) => {
	expect(signedMessage).to.have.property("message").that.equals(message);
	expect(signedMessage)
		.to.have.property("publicKey")
		.that.equals(keypair.publicKey);
	expect(signedMessage).to.have.property("signature").that.is.a("string");
};

const message = "Hello, world!";

const signMessage = ({ type }) => {
	const keypair = Keys.keypair({ type: type });
	let signedMessage;
	if (type === "ed25519") {
		signedMessage = Signature.sign({
			message: message,
			secretKey: keypair.secretKey,
			type: type
		});
	} else if (type === "secp256k1") {
		signedMessage = Signature.sign({
			message: message,
			privateKey: keypair.privateKey,
			type: type
		});
	}
	expectSignMessage({ signedMessage, message, keypair });
	return signedMessage;
};

const verifyMessage = ({ type, signedMessage, secondSignedMessage }) => {
	const publicKey = !secondSignedMessage
		? signedMessage.publicKey
		: secondSignedMessage.publicKey;
	const verifiedMessage = Signature.verify({
		message: signedMessage.message,
		publicKey: publicKey,
		signature: signedMessage.signature,
		type: type
	});
	if (!secondSignedMessage) {
		expect(verifiedMessage).to.be.true;
	} else {
		expect(verifiedMessage).to.be.false;
	}
};

const signAndVerifyMessage = ({ type }) => {
	const signedMessage = signMessage({ type: type });
	verifyMessage({ type: type, signedMessage });
};

const failSignAndVerifyMessage = ({ type }) => {
	const signedMessage = signMessage({ type: type });
	const secondSignedMessage = signMessage({ type: type });
	verifyMessage({
		type: type,
		signedMessage,
		secondSignedMessage
	});
};

describe("Signature tests", () => {
	it("should sign and verify message with ed25519", () => {
		signAndVerifyMessage({ type: "ed25519" });
	});

	it("should sign and verify message with secp256k1", () => {
		signAndVerifyMessage({ type: "secp256k1" });
	});

	it("should fail sign and verify message with ed25519", () => {
		failSignAndVerifyMessage({ type: "ed25519" });
	});

	it("should fail sign and verify message with secp256k1", () => {
		failSignAndVerifyMessage({ type: "secp256k1" });
	});
});
