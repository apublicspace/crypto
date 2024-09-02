const { expect } = require("chai");
const Keys = require("../index.js");
const secp256k1 = require("secp256k1");
const nacl = require("tweetnacl");

const expectKeypair = ({ type, mnemonic, passphrase }) => {
	let keypair;
	if (mnemonic) {
		const mnemonic = Keys.mnemonic({ words: 12, language: "english" });
		keypair = Keys.keypairFromMnemonic({
			mnemonic: mnemonic,
			passphrase: passphrase,
			type: type
		});
	} else {
		keypair = Keys.keypair({ type: type });
	}
	expect(keypair).to.have.property("publicKey");
	if (type === "ed25519") {
		expect(keypair).to.have.property("secretKey");
	} else if (type === "secp256k1") {
		expect(keypair).to.have.property("privateKey");
	}
	if (type === "ed25519") {
		expect(keypair.publicKey).to.have.lengthOf(32);
		expect(keypair.secretKey).to.have.lengthOf(64);
		const derivedKeypair = nacl.sign.keyPair.fromSecretKey(keypair.secretKey);
		expect(Buffer.from(derivedKeypair.publicKey)).to.deep.equal(
			keypair.publicKey
		);
	} else if (type === "secp256k1") {
		expect(keypair.publicKey).to.have.lengthOf(33);
		expect(keypair.privateKey).to.have.lengthOf(32);
		const valid = secp256k1.publicKeyVerify(keypair.publicKey);
		expect(valid).to.be.true;
		const derivedPublicKey = secp256k1.publicKeyCreate(keypair.privateKey);
		expect(Buffer.from(derivedPublicKey)).to.deep.equal(keypair.publicKey);
	}
	return keypair;
};

describe("Keys tests", () => {
	it("should create mnemonic", () => {
		let mnemonic = Keys.mnemonic({ words: 12, language: "english" });
		expect(mnemonic).to.be.a("string");
		expect(mnemonic.split(" ")).to.have.lengthOf(12);
		mnemonic = Keys.mnemonic({ words: 24, language: "english" });
		expect(mnemonic).to.be.a("string");
		expect(mnemonic.split(" ")).to.have.lengthOf(24);
	});

	it("should create ed25519 keypair", () => {
		expectKeypair({ type: "ed25519" });
	});

	it("should create secp256k1 keypair", () => {
		expectKeypair({ type: "secp256k1" });
	});

	it("should derive ed25519 keypair from mnemonic", () => {
		expectKeypair({ type: "ed25519", mnemonic: true });
	});

	it("should derive secp256k1 keypair from mnemonic", () => {
		expectKeypair({ type: "secp256k1", mnemonic: true });
	});

	it("should derive ed25519 keypair from mnemonic with passphrase", () => {
		expectKeypair({
			type: "ed25519",
			mnemonic: true,
			passphrase: "passphrase123"
		});
	});

	it("should derive secp256k1 keypair from mnemonic with passphrase", () => {
		expectKeypair({
			type: "secp256k1",
			mnemonic: true,
			passphrase: "passphrase123"
		});
	});
});
