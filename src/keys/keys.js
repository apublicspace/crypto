const crypto = require("crypto");
const bip39 = require("bip39");
const bs58 = require("bs58");
const secp256k1 = require("secp256k1");
const nacl = require("tweetnacl");

function mnemonic() {
	try {
		const mnemonic = bip39.generateMnemonic();
		return mnemonic;
	} catch (e) {
		console.log(e);
		return "Error: failed to generate mnemonic";
	}
}

function keypair({ type }) {
	try {
		if (type === "ed25519") {
			const keypair = nacl.sign.keyPair();
			const publicKeyBase58 = bs58.encode(Buffer.from(keypair.publicKey));
			const privateKeyBase58 = bs58.encode(Buffer.from(keypair.secretKey));
			return {
				pubkey: publicKeyBase58,
				privkey: privateKeyBase58
			};
		} else if (type === "secp256k1") {
			let privateKey;
			do {
				privateKey = crypto.randomBytes(32);
			} while (!secp256k1.privateKeyVerify(privateKey));
			const publicKey = secp256k1.publicKeyCreate(privateKey);
			return {
				pubkey: bs58.encode(publicKey),
				privkey: bs58.encode(privateKey)
			};
		} else {
			return "Error: unsupported curve type";
		}
	} catch (e) {
		console.log(e);
		return "Error: failed to generate keypair";
	}
}

function keypairFromMnemonic({ mnemonic, passphrase, type }) {
	try {
		let seed;
		if (passphrase) {
			seed = bip39.mnemonicToSeedSync(mnemonic, passphrase).subarray(0, 32);
		} else {
			seed = bip39.mnemonicToSeedSync(mnemonic).subarray(0, 32);
		}
		if (type === "ed25519") {
			const keypair = nacl.sign.keyPair.fromSeed(seed);
			const publicKeyBase58 = bs58.encode(Buffer.from(keypair.publicKey));
			const privateKeyBase58 = bs58.encode(Buffer.from(keypair.secretKey));
			return {
				pubkey: publicKeyBase58,
				privkey: privateKeyBase58
			};
		} else if (type === "secp256k1") {
			const privateKey = seed;
			const publicKey = secp256k1.publicKeyCreate(privateKey);
			return {
				pubkey: bs58.encode(publicKey),
				privkey: bs58.encode(privateKey)
			};
		} else {
			return "Error: unsupported curve type";
		}
	} catch (e) {
		console.log(e);
		return "Error: failed to generate keypair from mnemonic";
	}
}

module.exports = { mnemonic, keypair, keypairFromMnemonic };
