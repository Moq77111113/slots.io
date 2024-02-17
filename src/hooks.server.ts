import type { Handle } from '@sveltejs/kit';

import { initContext } from '$application/context';

export const handle = (async ({ event, resolve }) => {
	const context = await initContext(event);
	event.locals.context = context;

	return await resolve(event);
}) satisfies Handle;
