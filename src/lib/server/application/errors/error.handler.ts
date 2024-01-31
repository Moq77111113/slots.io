import type { DomainError, ErrorHandler } from '$domain/@shared/errors';

type DefaultErrorHandlerContext = {};

/**
 *
 * @description This is the default error handler. It will log the error and throw it, we'll change it later
 */
export const DefaultErrorHandler = (context: DefaultErrorHandlerContext): ErrorHandler => {
	const {} = context;
	const throws = (error: DomainError) => {
		console.error(`Received error: ${error.key} with following message: ${error.message}`);
		throw new Error(error.message);
	};
	return { throws };
};
