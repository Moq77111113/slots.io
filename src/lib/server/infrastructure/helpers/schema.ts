import { z } from 'zod';

const userSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	notificationsChannel: z.array(z.string()).default([]),
	lastLogin: z.date().nullable(),
	thirdPartyAccounts: z
		.array(z.object({ accountId: z.string(), provider: z.string() }))
		.default([]),
	language: z.object({
		code: z.union([z.literal('fr'), z.literal('en')]).default('fr')
	}),
	locale: z.union([z.literal('fr_FR'), z.literal('en_GB')]).default('fr_FR'),
	password: z.string().default(''),
	salt: z.string().default(''),
	accessToken: z.string().optional(),
	status: z.enum(['active', 'inactive']),
	createdAt: z.date(),
	updatedAt: z.date()
});

export const DomainSchemas = {
	User: userSchema
};

type ResultWithError<T extends z.AnyZodObject> =
	| [result: undefined, error: z.inferFlattenedErrors<T>]
	| [result: z.infer<T>, error: undefined];
export const validateData = <Schema extends z.AnyZodObject, Data = z.infer<Schema>>(
	data: Data,
	schema: Schema
): ResultWithError<Schema> => {
	try {
		const parsed = schema.parse(data);
		return [parsed, undefined];
	} catch (err) {
		const error = err instanceof z.ZodError ? err.flatten() : new z.ZodError([]).flatten();
		return [undefined, error];
	}
};
