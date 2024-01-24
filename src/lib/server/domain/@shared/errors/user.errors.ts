import { DomainError, type ErrorCollection } from '$domain/@shared/errors/errors';

type Keys = 'user:duplicated' | 'user:not-found';
export const UserErrors = {
	already_exists: (email: string) =>
		DomainError(
			{
				key: 'user:duplicated',
				message: `An user with email ${email} already exists`,
				statusCode: 'bad_data'
			},
			{ email }
		),
	not_found: DomainError({
		key: 'user:not-found',
		message: 'User not found',
		statusCode: 'not_found'
	})
} as const satisfies ErrorCollection<Keys>;

export type UserErrorKeys = Keys;
