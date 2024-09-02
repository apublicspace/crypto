declare module "@publicspace/crypto" {
	/**
	 * Processes the provided data and returns a JSON stringified HTTP response.
	 * The response varies depending on the presence of `unauthorized` or `error` fields in the data.
	 * @param {Object} params - the data.
	 * @returns a JSON stringified HTTP response.
	 */
	export function response(params: { data: any }): string;

	/**
	 * Returns the corresponding word from the BIP-39 wordlist based on the provided number and language.
	 * @param {Object} params - the number and the language.
	 * @returns a string of the corresponding word from the BIP-39 wordlist.
	 */
	export function wordFromNumber(params: {
		number: number;
		language: string;
	}): string;

	/**
	 * Returns the corresponding number from the BIP-39 wordlist based on the provided word and language.
	 * @param {Object} params - the word and the language.
	 * @returns an integer of the corresponding number from the BIP-39 wordlist.
	 */
	export function numberFromWord(params: {
		word: string;
		language: string;
	}): number;
}
