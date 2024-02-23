export const keys = <K extends string>(object: Partial<Record<K, unknown>>): K[] => {
	return Object.keys(object) as K[];
};

export const entries = <K extends string, V>(
	object: Partial<Record<K, V>>
): readonly Partial<[K, V]>[] => Object.entries(object) as [K, V][];

export const nonNullable = <T>(value: T | null | undefined): value is T =>
	value != null || value !== undefined;
