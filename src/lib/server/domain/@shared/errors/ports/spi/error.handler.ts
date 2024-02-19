import type { DomainError, DomainErrorKeys } from '#/domain/@shared/errors';

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
	throws<K extends DomainErrorKeys, T>(error: DomainError<K, T>): never;
}
