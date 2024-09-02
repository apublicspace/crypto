declare module "@publicspace/crypto" {
	/**
	 * Prepares a package with a unique statement for the user to sign.
	 * @param {Object} params - the domain and the public key.
	 * @returns an object of the result.
	 */
	export function prepare(params: { domain: string; publicKey: string }): object;

	/**
	 * Creates a token that represents the signed authorization package.
	 * @param {Object} params - the domain, public key, statement, signature, and optional expires.
	 * @returns an object of the result.
	 */
	export function token(params: {
		domain: string;
		publicKey: Uint8Array;
		statement: string;
		signature: Uint8Array;
		expires?: number;
	}): object;

	/**
	 * Verifies the token and returns the SIWS instance if the token is valid and authorized.
	 * @param {Object} params - the token and the curve type.
	 * @returns an object of the result.
	 */
	export function certificate(params: { token: string; type: string }): object;
}
