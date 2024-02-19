import type { Provider } from '@supabase/supabase-js';

import type { ThirdPartyAccount } from '#/domain/@shared/attributes';
import type {
	AuthenticateUserArgs,
	OAuthAuthenticationArgs
} from '#/domain/user/dtos/in/authentication.input';
import { makeUserId } from '#/domain/user/models';
import type { AuthProvider } from '#/domain/user/ports/spi';
import type { SupabaseInfrastructure } from '#/infrastructure';
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

	const logout = async () => {
		await auth.signOut();
	};

	const getProviders = () => {
		return ['github'];
	};

	const generateThirdPartyRequest = async (provider: ThirdPartyAccount['provider']) => {
		const keys: Provider[] = ['google', 'github', 'facebook']; // May have to use a db to checkout wich one is enabled

		if (!(keys as string[]).includes(provider)) {
			throw new Error('Provider not supported');
		}
		const { data, error } = await auth.signInWithOAuth({
			provider: provider as Provider,
			options: {
				skipBrowserRedirect: true
			}
		});
		if (error || !data.url) {
			throw new Error(error?.message || 'Unable to generate auth request');
		}

		const url = new URL(data.url);
		const codeVerifier = url.searchParams.get('code_challenge');
		return {
			provider: data.provider,
			authUrlWithoutRedirect: data.url,
			codeVerifier: codeVerifier || ''
		};
	};

	const authOrRegisterWithThirdParty = async (request: OAuthAuthenticationArgs) => {
		const { error, data } = await auth.exchangeCodeForSession(request.code);

		if (error || !data.user.id) {
			throw new Error(error?.message || 'Unable to authenticate with third party');
		}

		return makeUserId(data.user.id);
	};

	const getMe = async () => {
		const { data, error } = await auth.getUser();
		if (error || !data.user.id) {
			throw new Error(error?.message || 'Unable to retrieve user from subabase');
		}
		return makeUserId(data.user.id);
	};
	return {
		registerWithCredentials,
		authenticateWithCredentials,
		logout,
		getProviders,
		generateThirdPartyRequest,
		authOrRegisterWithThirdParty,
		getMe
	};
};
