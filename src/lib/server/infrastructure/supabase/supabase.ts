import { createServerClient } from '@supabase/ssr';

import type { Database, Tables } from './sb-types';

type SupabaseServerClientOptions = Parameters<typeof createServerClient>[2];
type SupabaseContext = {
	env: {
		APP_URL: string;
		APP_ANON: string;
	};
	options: SupabaseServerClientOptions;
};

export type Profile = Tables<'profiles'>;
export const SupabaseInfrastructure = (context: SupabaseContext) => {
	const { env, options } = context;

	const { auth, from } = createServerClient<Database>(env.APP_URL, env.APP_ANON, options);

	const profiles = from('profiles');
	return {
		auth,
		users: profiles
	};
};

export type SupabaseInfrastructure = ReturnType<typeof SupabaseInfrastructure>;
