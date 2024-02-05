import { z } from 'zod';

import { ISOLanguage, Locale } from '../common.schemas';

export const userSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	notificationsChannel: z.array(z.string()).default([]),
	lastLogin: z.date().nullable(),
	thirdPartyAccounts: z
		.array(z.object({ accountId: z.string(), provider: z.string() }))
		.default([]),
	language: z.object({
		code: ISOLanguage.default('fr')
	}),
	locale: Locale.default('fr_FR'),
	status: z.enum(['active', 'inactive']),
	createdAt: z.date(),
	updatedAt: z.date()
});

export type UserSchema = typeof userSchema;
