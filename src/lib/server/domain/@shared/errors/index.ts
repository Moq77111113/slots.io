import { UserErrors } from './entities';
import type { DomainError } from './errors';
import type { ErrorHandler } from './ports/spi/error.handler';

const Errors = {
	User: UserErrors
} as const;

export { Errors };
export type { DomainError, ErrorHandler };
