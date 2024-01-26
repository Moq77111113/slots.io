import { z } from 'zod';

type ResultWithError<T> =
	| [result: null, error: ReturnType<z.ZodError['flatten']> | null]
	| [result: T, error: null];
export const validateData = <Schema extends z.AnyZodObject, Data = z.infer<Schema>>(
	data: Data,
	schema: Schema
): ResultWithError<Data> => {
	try {
		const parsed = schema.parse(data);
		return [parsed as Data, null];
	} catch (err) {
		const error = err instanceof z.ZodError ? err.flatten() : new z.ZodError([]).flatten();
		return [null, error];
	}
};
