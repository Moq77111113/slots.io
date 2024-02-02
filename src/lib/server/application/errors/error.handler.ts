import type { DomainError, ErrorHandler } from '$domain/@shared/errors';

type DefaultErrorHandlerContext = {
	//
};

/**
 *
 * @description This is the default error handler. It will log the error and throw it, we'll change it later
 */
export const DefaultErrorHandler = (_context: DefaultErrorHandlerContext): ErrorHandler => {
	const throws = (error: DomainError) => {
		const date = new Date();
		const hour = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const milliseconds = date.getMilliseconds();
		const timelog = `${hour}:${minutes}:${seconds}:${milliseconds}`;
		console.error(`${timelog}\t ${error.key} : ${error.message}`);
		throw new Error(error.message);
	};
	return { throws };
};
