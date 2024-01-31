import { z } from 'zod';

const FrenchLocales = z.union([
	z.literal('fr_FR'),
	z.literal('fr_BE'),
	z.literal('fr_CH'),
	z.literal('fr_CA')
]);

const EnglishLocales = z.union([
	z.literal('en_US'),
	z.literal('en_GB'),
	z.literal('en_CA'),
	z.literal('en_AU'),
	z.literal('en_NZ'),
	z.literal('en_IN')
]);

const ISOLanguage = z.union([z.literal('fr'), z.literal('en')]);
export const Locale = z.union([FrenchLocales, EnglishLocales]);

const userSchema = z.object({
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
