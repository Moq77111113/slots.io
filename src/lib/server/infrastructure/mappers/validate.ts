import { z } from 'zod';

type ResultWithError<T extends z.AnyZodObject> =
	| [result: undefined, error: z.inferFlattenedErrors<T>]
	| [result: z.infer<T>, error: undefined];

export const validateData = <Schema extends z.AnyZodObject>(
	data: unknown,
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
