const crypto = require("crypto");
const bs58 = require("bs58");
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
		const cert = {
			domain,
			publicKey,
			statement,
			signature: bs58.encode(signature),
			issued: now,
			expires: expiration
		};
		const data = Buffer.from(JSON.stringify(cert));
		return data.toString("base64");
	} catch (e) {
		return "Error: failed to create token";
	}
}

function certificate({ token, type }) {
	try {
		const data = Buffer.from(token, "base64");
		const certificate = JSON.parse(data.toString("utf8"));
		if (Date.now() >= certificate.expires) {
			return "Unauthorized: certificate expired";
		}
		const statementBytes = new TextEncoder().encode(certificate.statement);
		const publicKeyBytes = bs58.decode(certificate.publicKey);
		const signatureBytes = bs58.decode(certificate.signature);
		let authorized;
		if (type === "ed25519") {
			authorized = nacl.sign.detached.verify(
				statementBytes,
				signatureBytes,
				publicKeyBytes
			);
		} else if (type === "secp256k1") {
			const msgHash = crypto
				.createHash("sha256")
				.update(statementBytes)
				.digest();
			authorized = secp256k1.ecdsaVerify(
				signatureBytes,
				msgHash,
				publicKeyBytes
			);
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
