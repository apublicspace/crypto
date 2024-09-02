const crypto = require("crypto");
const secp256k1 = require("secp256k1");
const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");

function sign({ message, secretKey, privateKey, type }) {
	try {
		let signature, publicKey;
		if (type === "ed25519") {
			const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
			publicKey = keyPair.publicKey;
			const decodedMessage = nacl.util.decodeUTF8(message);
			signature = nacl.sign.detached(decodedMessage, secretKey);
		} else if (type === "secp256k1") {
			const msgHash = crypto.createHash("sha256").update(message).digest();
			signature = secp256k1.ecdsaSign(msgHash, privateKey).signature;
			publicKey = secp256k1.publicKeyCreate(privateKey);
		} else {
			return "Error: unsupported curve type";
		}
		return {
			message: message,
			publicKey: publicKey,
			signature: signature
		};
	} catch (e) {
		return "Error: failed to sign message";
	}
}

function verify({ message, publicKey, signature, type }) {
	try {
		let authorized;
		if (type === "ed25519") {
			const decodedMessage = nacl.util.decodeUTF8(message);
			authorized = nacl.sign.detached.verify(
				decodedMessage,
				signature,
				publicKey
			);
		} else if (type === "secp256k1") {
			const msgHash = crypto.createHash("sha256").update(message).digest();
			authorized = secp256k1.ecdsaVerify(signature, msgHash, publicKey);
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
