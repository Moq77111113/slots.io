import { type UserErrorKeys, UserErrors } from './entities';
import type { DomainError, ErrorCollection } from './errors';
import type { ErrorHandler } from './ports/spi/error.handler';

type ErrorKeys = UserErrorKeys;

const Errors = {
	User: UserErrors
} as const satisfies Record<string, ErrorCollection<ErrorKeys>>;

export { Errors };
export type { DomainError, ErrorHandler, ErrorKeys };
