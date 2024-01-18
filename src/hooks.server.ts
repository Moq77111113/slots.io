import { initContext } from '$application/context';
import type { Handle } from '@sveltejs/kit';

const context = initContext();

export const handle = (async ({ event, resolve }) => {
	event.locals.context = context;

	return resolve(event);
}) satisfies Handle;
