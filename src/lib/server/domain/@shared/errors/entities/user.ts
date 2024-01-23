import { DomainError } from '../errors';

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
} as const;

export type UserErrors = keyof typeof UserErrors;
