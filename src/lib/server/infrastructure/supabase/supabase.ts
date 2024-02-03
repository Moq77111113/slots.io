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

export type SbProfile = Tables<'profiles'>;

type SbAvailability = Tables<'availabilities'>;
type SbSlot = Tables<'slots'> & { availabilities: SbAvailability[] };
export type SbHuddle = Tables<'huddles'> & { slots: SbSlot[] };

export const SupabaseInfrastructure = (context: SupabaseContext) => {
	const { env, options } = context;

	const { auth, from } = createServerClient<Database>(env.APP_URL, env.APP_ANON, options);

	const profiles = from('profiles');
	const huddles = from('huddles');
	return {
		auth,
		users: profiles,
		huddles
	};
};

export type SupabaseInfrastructure = ReturnType<typeof SupabaseInfrastructure>;
