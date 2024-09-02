const crypto = require("crypto");
const secp256k1 = require("secp256k1");
const nacl = require("tweetnacl");

function prepare({ domain, publicKey }) {
	try {
		const nonce = crypto.randomBytes(16).toString("hex");
		const statement = `I authorize ${domain} to start an account session with my public key ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}.\n\nNonce: ${nonce}`;
		return statement;
	} catch (e) {
		return "Error: failed to prepare message";
	}
}

function token({ domain, publicKey, statement, signature, expires }) {
	try {
		const now = Date.now();
		const expiration = expires ? now + expires : "never";
		const certificate = {
			domain,
			publicKey,
			statement,
			signature,
			issued: now,
			expires: expiration
		};
		return Buffer.from(JSON.stringify(certificate)).toString("base64");
	} catch (e) {
		return "Error: failed to create token";
	}
}

function certificate({ token, type }) {
	try {
		const certificate = JSON.parse(
			Buffer.from(token, "base64").toString("utf8")
		);
		if (Date.now() >= certificate.expires) {
			return "Unauthorized: certificate expired";
		}
		const statement = new TextEncoder().encode(certificate.statement);
		const publicKey = new Uint8Array(Object.values(certificate.publicKey));
		const signature = new Uint8Array(Object.values(certificate.signature));
		let authorized;
		if (type === "ed25519") {
			authorized = nacl.sign.detached.verify(statement, signature, publicKey);
		} else if (type === "secp256k1") {
			const msgHash = crypto.createHash("sha256").update(statement).digest();
			authorized = secp256k1.ecdsaVerify(signature, msgHash, publicKey);
		} else {
			return "Error: unsupported curve type";
		}
		if (!authorized) {
			return "Unauthorized: bad signature";
		}
		return certificate;
	} catch (e) {
		return "Error: failed to decode token";
	}
}

module.exports = { prepare, token, certificate };
