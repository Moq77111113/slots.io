import type { DomainError } from '$domain/@shared/errors';

/**
 * @description SPI ports for error handling
 * @example
 * ```ts
 * const MyErrorHandler = () => {
 *	const handle = (error: DomainError) => {
 *		// do something with the error
 *		throw new Error(error.message);
 *	};
 *
 *	return { handle } satisfies ErrorHandler;
 * };
 * ```
 */
export interface ErrorHandler {
	handle<T, K extends string>(error: DomainError<T, K>): never;
}

