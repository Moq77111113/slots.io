import { DomainError, type ErrorCollection } from '#/domain/@shared/errors/errors';

type Keys = 'not-implemented';
export const CommonErrors = {
	not_implemented: DomainError({
		key: 'not-implemented',
		message: 'Not implemented',
		statusCode: 'not_implemented'
	})
} as const satisfies ErrorCollection<Keys>;

export type CommonErrorKeys = Keys;
