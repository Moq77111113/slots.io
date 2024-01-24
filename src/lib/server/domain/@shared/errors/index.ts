import type { DomainError, ErrorCollection } from '$domain/@shared/errors/errors';
import type { ErrorHandler } from '$domain/@shared/errors/ports/spi/error.handler';
import { type UserErrorKeys, UserErrors } from '$domain/@shared/errors/user.errors';

/**
 * @description List of keys available for domain errors
 */
type DomainErrorKeys = UserErrorKeys;

/**
 * @description Collection of domain errors
 */
const DomainErrors = {
	User: UserErrors
} as const satisfies Record<string, ErrorCollection<DomainErrorKeys>>;

export { DomainErrors };
export type { DomainError, ErrorHandler, DomainErrorKeys };
