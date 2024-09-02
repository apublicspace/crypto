declare module "@publicspace/crypto" {
	/**
	 * Signs a message using a private key.
	 * @param {Object} params - the message, secret key (ed25519), private key (secp256k1), and curve type.
	 * @returns an object of the result.
	 */
	export function sign(params: {
		message: string;
		secretKey?: Uint8Array;
		privateKey?: Uint8Array;
		type: string;
	}): object;

	/**
	 * Verifies a signed message.
	 * @param {Object} params - the message, public key, signature, and curve type.
	 * @returns a boolean of the result.
	 */
	export function verify(params: {
		message: string;
		publicKey: Uint8Array;
		signature: Uint8Array;
		type: string;
	}): boolean;
}
