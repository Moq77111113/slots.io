import type { DomainErrorKeys } from '$domain/@shared/errors';

type ErrorCode =
	| 'bad_data'
	| 'bad_request'
	| 'not_found'
	| 'duplicate'
	| 'unauthorized'
	| 'forbidden'
	| 'internal'
	| 'not_implemented';

const statusToCode = {
	bad_request: 400,
	unauthorized: 401,
	forbidden: 403,
	not_found: 404,
	duplicate: 409,
	bad_data: 422,
	internal: 500,
	not_implemented: 501
} as const;

type StatusCode = (typeof statusToCode)[ErrorCode];
/**
 * @description Internal Error entity
 * It should not be used directly, use DomainError instead
 */
class _DomainError<Key extends DomainErrorKeys, T> extends Error {
	key: Key;
	statusCode: StatusCode;
	message: string;
	data?: T;
	constructor(args: { message: string; key: Key; statusCode: ErrorCode }, data?: T) {
		super(args.message);
		this.key = args.key;
		this.statusCode = statusToCode[args.statusCode];
		this.message = args.message;
		this.data = data;
		this.name = args.key;
		this.stack = new Error().stack?.split('\n').slice(3).join('\n');
	}
}

/**
 *
 * @description Creates a domain error
 * The message param should be a system error (eg for logging into external services)
 */
export const DomainError = <Key extends DomainErrorKeys, T>(
	args: { message: string; key: Key; statusCode: ErrorCode },
	data?: T
) => {
	const { message, key, statusCode } = args;
	return new _DomainError(
		{
			message,
			key,
			statusCode
		},
		data
	);
};

/**
 * @description Body of a domain error
 */
export type DomainError<Key extends DomainErrorKeys = DomainErrorKeys, T = unknown> = ReturnType<
	typeof DomainError<Key, T>
>;

/**
 * @description Collection of domain errors
 */
export type ErrorCollection<Keys extends DomainErrorKeys> = Record<
	string,
	((...args: never[]) => DomainError<Keys>) | DomainError<Keys>
>;
