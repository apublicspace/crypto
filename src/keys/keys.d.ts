declare module "@publicspace/crypto" {
	/**
	 * Generates a mnemonic phrase.
	 * @returns The generated mnemonic phrase as a string.
	 */
	export function mnemonic(): string;

	/**
	 * Generates a new key pair.
	 * @param {Object} params - The parameters include the curve type.
	 * @returns An object of the result.
	 */
	export function keypair(params: { type: string }): object;

	/**
	 * Generates a key pair from a mnemonic phrase.
	 * @param {Object} params - The parameters including the mnemonic, an optional passphrase, and curve type.
	 * @returns An object of the result.
	 */
	export function keypairFromMnemonic(params: {
		mnemonic: string;
		passphrase?: string;
		type: string;
	}): object;
}
