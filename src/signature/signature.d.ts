declare module "@publicspace/crypto" {
	/**
	 * Signs a message using a private key.
	 * @param {Object} params - The parameters including the message, secret key (ed25519), private key (secp256k1), and curve type.
	 * @returns An object of the result.
	 */
	export function sign(params: {
		message: string;
		secretKey: string;
		privateKey: string;
		type: string;
	}): object;

	/**
	 * Verifies a signed message.
	 * @param {Object} params - The parameters including the message, public key, signature, and curve type.
	 * @returns A boolean of the result.
	 */
	export function verify(params: {
		message: string;
		publicKey: string;
		signature: string;
		type: string;
	}): boolean;
}
