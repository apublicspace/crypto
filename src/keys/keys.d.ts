declare module "@publicspace/crypto" {
	/**
	 * Generates a mnemonic phrase.
	 * @param {Object} params - the number of words and the language.
	 * @returns the generated mnemonic phrase as a string.
	 */
	export function mnemonic(params: { words: number, language: string }): string;

	/**
	 * Generates a new key pair.
	 * @param {Object} params - the curve type.
	 * @returns an object of the result.
	 */
	export function keypair(params: { type: string }): object;

	/**
	 * Generates a key pair from a mnemonic phrase.
	 * @param {Object} params - the mnemonic, optional passphrase, and curve type.
	 * @returns an object of the result.
	 */
	export function keypairFromMnemonic(params: {
		mnemonic: string;
		passphrase?: string;
		type: string;
	}): object;
}
