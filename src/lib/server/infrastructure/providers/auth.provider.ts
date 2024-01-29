import { makeUserId } from '$domain/user/models';
import type { AuthProvider } from '$domain/user/ports/spi';
import type { AuthenticateUserArgs } from '$domain/user/services/types';
import type { SupabaseInfrastructure } from '$infrastructure';

export const SupabaseAuthProvider = ({
	auth
}: {
	auth: SupabaseInfrastructure['auth'];
}): AuthProvider => {
	const registerWithCredentials = async ({ email, password }: AuthenticateUserArgs) => {
		const { error, data } = await auth.signUp({ email, password });

		if (error) {
			throw new Error(error.message);
		}

		if (!data.user?.id) {
			throw new Error('An error occured while registering the user');
		}
		return makeUserId(data.user.id);
	};

	const authenticateWithCredentials = async ({ email, password }: AuthenticateUserArgs) => {
		const { error, data } = await auth.signInWithPassword({ email, password });
		if (error) {
			throw new Error(error.message);
		}
		if (!data.user.id) {
			throw new Error('An error occured while authenticating the user');
		}
		return makeUserId(data.user.id);
	};
	return {
		registerWithCredentials,
		authenticateWithCredentials
	};
};
