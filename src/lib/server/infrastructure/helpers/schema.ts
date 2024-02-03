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
const Locale = z.union([FrenchLocales, EnglishLocales]);

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

const AvailabilityStatus = z.union([
	z.literal('available'),
	z.literal('unavailable'),
	z.literal('maybe')
]);

const availabilitySchema = z.object({
	userId: z.string(),
	status: AvailabilityStatus
});

const slotSchema = z.object({
	id: z.string(),
	start: z.date(),
	end: z.date(),
	availabilities: z.array(availabilitySchema).default([]),
	createdAt: z.date(),
	updatedAt: z.date()
});

const huddleSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	creatorId: z.string(),
	slots: z.array(slotSchema).default([]),
	locked: z.boolean(),
	expiration: z.date().optional(),
	participantIds: z.array(z.string()).default([])
});

export const DomainSchemas = {
	User: userSchema,
	Huddle: huddleSchema
};

export type ZodUserSchema = typeof userSchema;
export type ZodHuddleSchema = typeof huddleSchema;

export type DomainSchemas = {
	User: ZodUserSchema;
	Huddle: ZodHuddleSchema;
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
