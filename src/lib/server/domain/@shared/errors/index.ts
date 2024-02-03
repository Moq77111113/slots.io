import { type CommonErrorKeys, CommonErrors } from '$domain/@shared/errors/common.errors';
import type { DomainError, ErrorCollection } from '$domain/@shared/errors/errors';
import { type PollErrorKeys, PollErrors } from '$domain/@shared/errors/poll.errors';
import type { ErrorHandler } from '$domain/@shared/errors/ports/spi/error.handler';
import { type UserErrorKeys, UserErrors } from '$domain/@shared/errors/user.errors';

/**
 * @description List of keys available for domain errors
 */
type DomainErrorKeys = CommonErrorKeys | UserErrorKeys | PollErrorKeys;

/**
 * @description Collection of domain errors
 */
const DomainErrors = {
	User: UserErrors,
	Poll: PollErrors,
	Common: CommonErrors
} as const satisfies Record<string, ErrorCollection<DomainErrorKeys>>;

export { DomainErrors };
export type { DomainError, ErrorHandler, DomainErrorKeys };
