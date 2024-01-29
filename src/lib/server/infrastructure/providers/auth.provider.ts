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
		const result = await auth.signUp({ email, password });

		if (result.error) {
			throw new Error(result.error.message);
		}

		if (!result.data.user?.id) {
			throw new Error('An error occured while registering the user');
		}
		return makeUserId(result.data.user.id);
	};

	return {
		registerWithCredentials
	};
};
