import type { DomainErrorKeys } from '$domain/@shared/errors';

type ErrorCode =
	| 'bad_data'
	| 'bad_request'
	| 'not_found'
	| 'duplicate'
	| 'unauthorized'
	| 'forbidden'
	| 'internal';

const statusToCode = {
	bad_request: 400,
	unauthorized: 401,
	forbidden: 403,
	not_found: 404,
	duplicate: 409,
	bad_data: 422,
	internal: 500
} as const satisfies Record<ErrorCode, number>;

/**
 *
 * @description Creates a domain error
 * The message param should be a system error (eg for logging into external services)
 */
export const DomainError = <T, Key extends DomainErrorKeys>(
	args: { message: string; key: Key; statusCode: ErrorCode },
	data?: T
) => {
	const { message, key, statusCode } = args;
	return {
		message,
		key,
		statusCode: statusToCode[statusCode],
		data
	};
};

/**
 * @description Body of a domain error
 */
export type DomainError<T = unknown, Key extends DomainErrorKeys = DomainErrorKeys> = ReturnType<
	typeof DomainError<T, Key>
>;

/**
 * @description Collection of domain errors
 */
export type ErrorCollection<Keys extends DomainErrorKeys> = Record<
	string,
	((...args: never[]) => DomainError<unknown, Keys>) | DomainError<unknown, Keys>
>;