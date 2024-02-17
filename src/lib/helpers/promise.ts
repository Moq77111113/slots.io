/**
 * @description Wraps a function with error handling to make it recoverable.
 *
 */
export const recoverable = async <T, E>(
	fn: () => T | Promise<T>
): Promise<[result: Awaited<T>, error?: undefined] | [result: undefined, error: E]> => {
	try {
		const result = await fn();
		return [result, undefined];
	} catch (error) {
		return [undefined, error as E];
	}
};
