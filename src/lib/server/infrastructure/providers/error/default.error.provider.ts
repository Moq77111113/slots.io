import type { DomainError, ErrorHandler } from '#/domain/@shared/errors';

type DefaultErrorProviderContext = {
	//
};

/**
 *
 * @description This is the default error handler. It will log the error and throw it, we'll change it later
 */
export const DefaultErrorProvider = (_context: DefaultErrorProviderContext): ErrorHandler => {
	const throws = (error: DomainError) => {
		const date = new Date();
		const hour = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const milliseconds = date.getMilliseconds();
		const timeLog = `${hour}:${minutes}:${seconds}:${milliseconds}`;
		console.error(`${timeLog}\t ${error.key} : ${error.message}`);
		throw new Error(error.message);
	};
	return { throws };
};
