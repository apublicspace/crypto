const { expect } = require("chai");
const Auth = require("../index.js");
const Signature = require("../index.js");
const Keys = require("../index.js");
const bs58 = require("bs58").default;

const expectCertificate = ({
	certificate,
	domain,
	publicKey,
	statement,
	signedMessage,
	expires
}) => {
	const publicKeyBytes = new Uint8Array(Object.values(certificate.publicKey));
	const signatureBytes = new Uint8Array(Object.values(certificate.signature));
	expect(certificate).to.have.property("domain").that.equals(domain);
	expect(certificate).to.have.property("publicKey");
	expect(publicKey).to.deep.equal(publicKeyBytes);
	expect(certificate).to.have.property("statement").that.equals(statement);
	expect(certificate).to.have.property("signature");
	expect(signedMessage.signature).to.deep.equal(signatureBytes);
	expect(certificate).to.have.property("issued");
	if (expires) {
		expect(certificate).to.have.property("expires").that.is.a("number");
	} else {
		expect(certificate).to.have.property("expires").that.equals("never");
	}
};

const domainKeypairAddress = ({ type }) => {
	const domain = "example.com";
	const keypair = Keys.keypair({ type: type });
	const publicKey = keypair.publicKey;
	return { domain, keypair, publicKey };
};

const prepareToken = ({ type }) => {
	const core = domainKeypairAddress({ type: type });
	const publicKey = bs58.encode(core.publicKey);
	const statement = Auth.prepare({
		domain: core.domain,
		publicKey
	});
	expect(statement).to.include(`I authorize ${core.domain}`);
	expect(statement).to.include(
		`my public key ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
	);
	expect(statement).to.include("Nonce:");
	return { core, statement };
};

const createToken = ({ type, expires }) => {
	const prepare = prepareToken({ type: type });
	let signedMessage;
	if (type === "ed25519") {
		signedMessage = Signature.sign({
			message: prepare.statement,
			secretKey: prepare.core.keypair.secretKey,
			type: type
		});
	} else if (type === "secp256k1") {
		signedMessage = Signature.sign({
			message: prepare.statement,
			privateKey: prepare.core.keypair.privateKey,
			type: type
		});
	}
	const token = Auth.token({
		domain: prepare.core.domain,
		publicKey: prepare.core.publicKey,
		statement: prepare.statement,
		signature: signedMessage.signature,
		expires
	});
	expect(token).to.be.a("string");
	return { prepare, signedMessage, token };
};

const certificate = ({ type }) => {
	const prepareSignedToken = createToken({ type: type });
	const certificate = Auth.certificate({
		token: prepareSignedToken.token,
		type: type
	});
	expectCertificate({
		certificate,
		domain: prepareSignedToken.prepare.core.domain,
		publicKey: prepareSignedToken.prepare.core.publicKey,
		statement: prepareSignedToken.prepare.statement,
		signedMessage: prepareSignedToken.signedMessage
	});
};

const expiredCertificate = ({ type, expires, timeout, done }) => {
	const prepareSignedToken = createToken({ type: type, expires: expires });
	const certificate = Auth.certificate({
		token: prepareSignedToken.token,
		type: type
	});
	expectCertificate({
		certificate,
		domain: prepareSignedToken.prepare.core.domain,
		publicKey: prepareSignedToken.prepare.core.publicKey,
		statement: prepareSignedToken.prepare.statement,
		signedMessage: prepareSignedToken.signedMessage,
		expires
	});
	setTimeout(() => {
		const certificate = Auth.certificate({
			token: prepareSignedToken.token,
			type: type
		});
		expect(certificate).to.equal("Unauthorized: certificate expired");
		done();
	}, timeout);
};

describe("Auth tests", () => {
	it("should prepare ed25519 token", () => {
		prepareToken({ type: "ed25519" });
	});

	it("should prepare secp256k1 token", () => {
		prepareToken({ type: "secp256k1" });
	});

	it("should create ed25519 token", () => {
		createToken({ type: "ed25519" });
	});

	it("should create secp256k1 token", () => {
		createToken({ type: "secp256k1" });
	});

	it("should verify ed25519 token with certificate", () => {
		certificate({ type: "ed25519" });
	});

	it("should verify secp256k1 token with certificate", () => {
		certificate({ type: "secp256k1" });
	});

	it("should fail to verify ed25519 expired token with certificate", (done) => {
		expiredCertificate({ type: "ed25519", expires: 10, timeout: 20, done });
	});

	it("should fail to verify secp256k1 expired token with certificate", (done) => {
		expiredCertificate({ type: "secp256k1", expires: 10, timeout: 20, done });
	});
});
