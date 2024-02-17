import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';

import { fail, redirect } from '@sveltejs/kit';

import { CreateHuddleAction } from '$application/actions';
import { recoverable } from '$lib/helpers/promise';

import type { Actions, PageServerLoad } from './$types';
import { huddleCreateSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(huddleCreateSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(huddleCreateSchema));
		if (!form.valid) return fail(400, { form });

		const CreateHuddle = CreateHuddleAction(locals.context);

		const { title, slots, description } = form.data;

		const [huddle, error] = await recoverable(() =>
			CreateHuddle.execute({
				title,
				description,
				slots: slots.map((slot) => ({
					start: new Date(slot.start),
					end: new Date(slot.start.getTime() + 24 * 60 * 60 * 1000),
					...(slot.availability && { availability: { status: slot.availability } })
				}))
			})
		);

		if (huddle) {
			return redirect(303, `/huddle/${huddle.id}`);
		}

		return message(form, { error: error instanceof Error ? error.message : 'Unknown Error' });
	}
};
