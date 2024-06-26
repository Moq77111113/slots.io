import { createServerClient } from '@supabase/ssr';

import type { Identity } from '#/domain/@shared/types';

import type { Database, Tables } from './sb-types';

type SupabaseServerClientOptions = Parameters<typeof createServerClient>[2];
type SupabaseContext = {
	env: {
		APP_URL: string;
		APP_ANON: string;
	};
	options: SupabaseServerClientOptions;
};

export type SbProfile = Identity<Tables<'profiles'>>;

export type SbAvailability = Identity<Tables<'availabilities'> & { user: SbProfile }>;
export type SbSlot = Identity<Tables<'slots'> & { availabilities: SbAvailability[] }>;

export type SbHuddle = Identity<
	Tables<'huddles'> & {
		creator: SbProfile;
		slots: SbSlot[];
		huddle_participant: { user: SbProfile }[];
	}
>;

export const SupabaseInfrastructure = (context: SupabaseContext) => {
	const { env, options } = context;

	const client = createServerClient<Database>(env.APP_URL, env.APP_ANON, options);

	const profiles = client.from('profiles');
	const huddles = client.from('huddles');
	const slots = client.from('slots');
	const availabilities = client.from('availabilities');
	const huddle_participant = client.from('huddle_participant');
	return {
		auth: client.auth,
		users: profiles,
		huddleResources: {
			huddles,
			slots,
			availabilities,
			huddle_participant
		}
	};
};

export type SupabaseInfrastructure = ReturnType<typeof SupabaseInfrastructure>;
