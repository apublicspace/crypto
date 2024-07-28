declare module "@publicspace/crypto" {
	/**
	 * Signs a message using a private key.
	 * @param {Object} params - The parameters including the message, private key, and curve type.
	 * @returns An object of the result.
	 */
	export function sign(params: {
		message: string;
		privkey: string;
		type: string;
	}): object;

	/**
	 * Verifies a signed message.
	 * @param {Object} params - The parameters including the message, public key, signature, and curve type.
	 * @returns A boolean of the result.
	 */
	export function verify(params: {
		message: string;
		pubkey: string;
		signature: string;
		type: string;
	}): boolean;
}
