import type { Handle } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const handle = (async ({ event, resolve }) => {
	event.locals.prisma = prisma;
	return resolve(event);
}) satisfies Handle;
