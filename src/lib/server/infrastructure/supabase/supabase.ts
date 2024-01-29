import { createServerClient } from '@supabase/ssr';

type SupabaseServerClientOptions = Parameters<typeof createServerClient>[2];
type SupabaseContext = {
	env: {
		APP_URL: string;
		APP_ANON: string;
	};
	options: SupabaseServerClientOptions;
};

export const SupabaseInfrastructure = (context: SupabaseContext) => {
	const { env, options } = context;

	const { auth } = createServerClient(env.APP_URL, env.APP_ANON, options);

	return {
		auth
	};
};

export type SupabaseInfrastructure = ReturnType<typeof SupabaseInfrastructure>;
