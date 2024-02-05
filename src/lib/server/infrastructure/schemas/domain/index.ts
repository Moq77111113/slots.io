import type { huddleSchema } from './huddle.schemas';
import type { userSchema } from './user.schemas';

type ZodUserSchema = typeof userSchema;
type ZodHuddleSchema = typeof huddleSchema;

export type DomainSchemas = {
	User: ZodUserSchema;
	Huddle: ZodHuddleSchema;
};
