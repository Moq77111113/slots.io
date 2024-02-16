import { superValidate } from 'sveltekit-superforms/server';

import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { huddleCreateSchema, slotAddSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(huddleCreateSchema),
		form2: await superValidate(slotAddSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, huddleCreateSchema);

		if (!form.valid) {
			console.log('failed', form);
			return fail(400, {
				form
			});
		}
		return {
			form
		};
	}
};
