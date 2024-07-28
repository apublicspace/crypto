declare module "@publicspace/crypto" {
	/**
	 * Prepares a package with a unique statement for the user to sign.
	 * @param {Object} params - The parameters including domain and public key.
	 * @returns An object of the result.
	 */
	export function prepare(params: { domain: string; pubkey: string }): object;

	/**
	 * Creates a token that represents the signed authorization package.
	 * @param {Object} params - The parameters including domain, public key, statement, signature, and optional expires.
	 * @returns An object of the result.
	 */
	export function token(params: {
		domain: string;
		pubkey: string;
		statement: string;
		signature: Uint8Array;
		expires?: number;
	}): object;

	/**
	 * Verifies the token and returns the SIWS instance if the token is valid and authorized.
	 * @param {Object} params - The parameters including the token and curve type.
	 * @returns An object of the result.
	 */
	export function certificate(params: { token: string; type: string }): object;
}
