import { error, fail } from '@sveltejs/kit';

import { makeHuddleId } from '$domain/huddle/models';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const huddle = await locals.context.apis.huddleRepo.findById(makeHuddleId(params.slug));

	if (!huddle) {
		throw error(404, { message: 'Huddle not found' });
	}
	return {
		huddle
	};
};
