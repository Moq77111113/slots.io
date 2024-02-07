import type { RequestEvent } from '@sveltejs/kit';

import type { ErrorHandler } from '$domain/@shared/errors';
import type { HuddleApi } from '$domain/huddle/ports/api';
import { HuddleService } from '$domain/huddle/services/huddle.service';
import type { UserApi } from '$domain/user/ports/api/user.api';
import { UserService } from '$domain/user/services/user.service';
import { DefaultErrorProvider, SupabaseInfrastructure } from '$infrastructure';
import { SupabaseUserRepository } from '$infrastructure/persistence';
import { SupabaseHuddleRepository } from '$infrastructure/persistence/huddle/sb.huddle.repository';
import { SupabaseAuthProvider } from '$infrastructure/providers/auth/sb.auth.provider';

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
		huddleApi: HuddleApi;
	};
};

/**
 * @description This function creates a new context (should be called at each api request).
 * @returns AppContext
 */
// TODO : Use an IoC container to create the context with correct bindings.
export const initContext = async (event: RequestEvent): Promise<AppContext> => {
	if (!process.env.PUBLIC_SUPABASE_URL || !process.env.PUBLIC_SUPABASE_ANON_KEY) {
		throw new Error('Missing environment variables');
	}

	const shared = {
		errorHandler: DefaultErrorProvider({})
	};
	const { auth, users, huddleResources } = SupabaseInfrastructure({
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

	const huddleRepo = SupabaseHuddleRepository({
		huddleResources
	});

	const huddleApi = HuddleService({
		repositories: {
			huddle: huddleRepo
		},
		apis: {
			meApi: userApi
		},
		shared
	});

	return Promise.resolve({
		shared,
		apis: {
			userApi,
			huddleApi
		}
	});
};
