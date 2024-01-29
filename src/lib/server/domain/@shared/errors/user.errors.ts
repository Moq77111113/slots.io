import { DomainError, type ErrorCollection } from '$domain/@shared/errors/errors';

type Keys =
	| 'user:duplicated'
	| 'user:not-found'
	| 'user:password-not-set'
	| 'user:invalid-credentials'
	| 'user:provider-not-enabled'
	| 'user:oauth-failed'
	| 'user:logout-failed';
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
	}),
	invalid_credentials: DomainError({
		key: 'user:invalid-credentials',
		message: 'Invalid credentials',
		statusCode: 'unauthorized'
	}),
	provider_not_enabled: (provider: string) =>
		DomainError({
			key: 'user:provider-not-enabled',
			message: `The provider ${provider} is not enabled`,
			statusCode: 'bad_request'
		}),
	oauth_failed: DomainError({
		key: 'user:oauth-failed',
		message: 'OAuth authentication failed',
		statusCode: 'internal'
	}),
	logout_failed: DomainError({
		key: 'user:logout-failed',
		message: 'Logout failed',
		statusCode: 'internal'
	})
} as const satisfies ErrorCollection<Keys>;

export type UserErrorKeys = Keys;
