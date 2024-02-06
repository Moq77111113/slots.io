import { createServerClient } from '@supabase/ssr';

import type { Identity } from '$domain/@shared/types';

import type { Database, Tables } from './sb-types';

type SupabaseServerClientOptions = Parameters<typeof createServerClient>[2];
type SupabaseContext = {
	env: {
		APP_URL: string;
		APP_ANON: string;
	};
	options: SupabaseServerClientOptions;
};

type NullableKeys<T> = {
	[P in keyof T]: T[P] extends undefined ? null : T[P];
};

export type SbProfile = Identity<Tables<'profiles'>>;

export type SbAvailability = NullableKeys<
	Identity<Tables<'availabilities'> & { user: SbProfile | null }>
>;
export type SbSlot = Identity<Tables<'slots'> & { availabilities: SbAvailability[] }>;

export type SbHuddle = Identity<
	Tables<'huddles'> & {
		creator: SbProfile | null;
		slots: SbSlot[];
		participants: SbProfile[] | null;
	}
>;

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
