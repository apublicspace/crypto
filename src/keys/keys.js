const crypto = require("crypto");
const bip39 = require("bip39");
const secp256k1 = require("secp256k1");
const nacl = require("tweetnacl");

function mnemonic({ words, language }) {
	try {
        bip39.setDefaultWordlist(language);
        const entropy = (words / 3) * 32;
        const mnemonic = bip39.generateMnemonic(entropy);
		return mnemonic
	} catch (e) {
		return "Error: failed to generate mnemonic";
	}
}

function keypair({ type }) {
	try {
		if (type === "ed25519") {
			const keypair = nacl.sign.keyPair();
			return {
				publicKey: keypair.publicKey,
				secretKey: keypair.secretKey
			};
		} else if (type === "secp256k1") {
			let privateKey;
			do {
				privateKey = new Uint8Array(crypto.randomBytes(32));
			} while (!secp256k1.privateKeyVerify(privateKey));
			const publicKey = secp256k1.publicKeyCreate(privateKey);
			return {
				publicKey: publicKey,
				privateKey: privateKey
			};
		} else {
			return "Error: unsupported curve type";
		}
	} catch (e) {
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
			return {
				publicKey: keypair.publicKey,
				secretKey: keypair.secretKey
			};
		} else if (type === "secp256k1") {
			const privateKey = seed;
			const publicKey = secp256k1.publicKeyCreate(privateKey);
			return {
				publicKey: publicKey,
				privateKey: privateKey
			};
		} else {
			return "Error: unsupported curve type";
		}
	} catch (e) {
		return "Error: failed to generate keypair from mnemonic";
	}
}

module.exports = { mnemonic, keypair, keypairFromMnemonic };
