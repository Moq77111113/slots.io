import type { Handle } from '@sveltejs/kit';

import { initContext } from '$application/context';

const context = await initContext();

export const handle = (async ({ event, resolve }) => {
	event.locals.context = context;

	return resolve(event);
}) satisfies Handle;
