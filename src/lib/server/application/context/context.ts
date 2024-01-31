import type { RequestEvent } from '@sveltejs/kit';

import { DefaultErrorHandler } from '$application/errors/error.handler';
import type { ErrorHandler } from '$domain/@shared/errors';
import type { UserApi } from '$domain/user/ports/api/user.api';
import { UserService } from '$domain/user/services/user.service';
import { SupabaseInfrastructure } from '$infrastructure';
import { SupabaseUserRepository } from '$infrastructure/persistence';
import { SupabaseAuthProvider } from '$infrastructure/providers/sb.auth.provider';

/**
 * `SharedContext` is a type that represents shared resources available to all actions in the application.
 */
export type SharedContext = {
	errorHandler: ErrorHandler;
};

/**
 * `AppContext` is a type that represents the context available to all actions in the application.
 *
 */
export type AppContext = {
	/**
	 * @description
	 * This is a shared context that is available to all actions.
	 */
	shared: SharedContext;
	/**
	 * @description
	 * This is a an api context that is available to all actions.
	 */
	apis: {
		userApi: UserApi;
	};
};

/**
 * @description This function creates a new context (should be called at each api request).
 * @returns AppContext
 */
// TODO : Use an IoC container to create the context with correct bindings.
export const initContext = (event: RequestEvent): AppContext => {
	if (!process.env.PUBLIC_SUPABASE_URL || !process.env.PUBLIC_SUPABASE_ANON_KEY) {
		throw new Error('Missing environment variables');
	}

	const shared = {
		errorHandler: DefaultErrorHandler({})
	};
	const { auth, users } = SupabaseInfrastructure({
		env: {
			APP_URL: process.env.PUBLIC_SUPABASE_URL,
			APP_ANON: process.env.PUBLIC_SUPABASE_ANON_KEY
		},
		options: {
			cookies: {
				get: (key) => event.cookies.get(key),

				set: (key, value, options) => {
					event.cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				}
			}
		}
	});

	const authProvider = SupabaseAuthProvider({ auth });
	const userRepository = SupabaseUserRepository({ users });

	const userApi = UserService({
		repositories: {
			userRepository
		},
		providers: {
			authProvider
		},
		shared
	});

	return {
		shared,
		apis: {
			userApi
		}
	};
};
