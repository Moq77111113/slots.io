import type { DomainError, DomainErrorKeys } from '$domain/@shared/errors';

/**
 * @description SPI ports for error handling
 * @example
 * ```ts
 * const MyErrorHandler = (): ErrorHandler => {
 *	const throws = (error: DomainError) => {
 *		// do something with the error
 *		throw new Error(error.message);
 *	};
 *
 *	return { throws };
 * };
 * ```
 */
export interface ErrorHandler {
	/**
	 *
	 * @description Grab a domain error and throw it
	 */
	throws<T, K extends DomainErrorKeys>(error: DomainError<T, K>): never;
}
