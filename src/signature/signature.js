const crypto = require("crypto");
const bs58 = require("bs58");
const secp256k1 = require("secp256k1");
const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");

function sign({ message, privkey, type }) {
	try {
		const privateKeyUint8Array = bs58.decode(privkey);
		let signature, publicKey;
		if (type === "ed25519") {
			const keyPair = nacl.sign.keyPair.fromSecretKey(privateKeyUint8Array);
			publicKey = keyPair.publicKey;
			const encodedMessage = nacl.util.decodeUTF8(message);
			signature = nacl.sign.detached(encodedMessage, privateKeyUint8Array);
		} else if (type === "secp256k1") {
			const msgHash = crypto.createHash("sha256").update(message).digest();
			signature = secp256k1.ecdsaSign(msgHash, privateKeyUint8Array).signature;
			publicKey = secp256k1.publicKeyCreate(privateKeyUint8Array);
		} else {
			return "Error: unsupported curve type";
		}
		const signatureBase58 = bs58.encode(Buffer.from(signature));
		const publicKeyBase58 = bs58.encode(Buffer.from(publicKey));
		return {
			message: message,
			pubkey: publicKeyBase58,
			signature: signatureBase58
		};
	} catch (e) {
		return "Error: failed to sign message";
	}
}

function verify({ message, pubkey, signature, type }) {
	try {
		const encodedMessage = nacl.util.decodeUTF8(message);
		const publicKeyUint8Array = bs58.decode(pubkey);
		const signatureUint8Array = bs58.decode(signature);
		let authorized;
		if (type === "ed25519") {
			authorized = nacl.sign.detached.verify(
				encodedMessage,
				signatureUint8Array,
				publicKeyUint8Array
			);
		} else if (type === "secp256k1") {
			const msgHash = crypto
				.createHash("sha256")
				.update(encodedMessage)
				.digest();
			authorized = secp256k1.ecdsaVerify(
				signatureUint8Array,
				msgHash,
				publicKeyUint8Array
			);
		} else {
			return "Error: unsupported curve type";
		}
		if (!authorized) {
			return false;
		}
		return true;
	} catch (e) {
		return "Error: failed to verify message";
	}
}

module.exports = { sign, verify };
