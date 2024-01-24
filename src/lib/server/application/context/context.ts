import type { UserService } from '$domain/user/services/user.service';

export type SharedContext = Record<string, never>;

/**
 * @description
 * This is the context that is available to all actions.
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
	 * This is a service context that is available to all actions.
	 */
	services: {
		user: UserService;
	};
};

/**
 * @description This function creates a new context.
 * @returns AppContext
 */
// TODO : Use an IoC container to create the context with correct bindings.
export const initContext = () => {
	const shared = {};

	throw new Error('Not implemented');
};
