declare module "@publicspace/crypto" {
	/**
	 * Processes the provided data and returns a JSON stringified HTTP response.
	 * The response varies depending on the presence of `unauthorized` or `error` fields in the data.
	 * @param {Object} params - The parameters including the data.
	 * @returns A JSON stringified HTTP response.
	 */
	export function response(params: { data: any }): string;

	/**
	 * Returns the corresponding word from the BIP-39 wordlist based on the provided number and language.
	 * @param {Object} params - The parameters including the number and language.
	 * @returns A string of the corresponding word from the BIP-39 wordlist.
	 */
	export function wordFromNumber(params: {
		number: number;
		language: string;
	}): string;
}
