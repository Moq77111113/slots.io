import { z } from 'zod';

import { ISOLanguage, Locale } from '../common.schemas';

export const supabaseUserSchema = z.object({
	created_at: z.string(),
	email: z.string(),
	id: z.string(),
	language: ISOLanguage.default('fr'),
	last_login: z.string().nullable(),
	locale: Locale.default('fr_FR'),
	status: z.boolean(),
	updated_at: z.string().nullable()
});
