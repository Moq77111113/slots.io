/**
 * A unique symbol used for branding.
 * @private
 */
declare const __brand: unique symbol;

/**
 * A helper type for creating branded types.
 * @template B - The brand.
 * @private
 */
type Brand<B> = { [__brand]: B };

/**
 * A type for creating branded versions of existing types.
 * Branded types are structurally identical to the original type,
 * but are considered distinct types by the TypeScript type checker.
 *
 * @template T - The original type.
 * @template B - The brand.
 * @public
 */
export type Branded<T, B extends string> = T & Brand<B>;

/**
 * Utility function for creating branded types.
 *
 * @template T - The base type.
 * @template BrandedType - The branded type.
 * @param {T} value - The value to be branded.
 * @param {function} assertFn - The type assertion function to ensure the value is of the correct type.
 * @returns {BrandedType} - The branded value.
 * @throws Will throw an error if the assertion fails.
 *
 * @example
 * // Define a branded type for Email
 * type Email = Branded<string, 'Email'>;
 *
 * // Define a type assertion function for Email
 * function assertIsEmail(x: unknown): asserts x is Email {
 *   if (typeof x !== 'string' || !/^\S+@\S+\.\S+$/.test(x)) {
 *     throw new Error('Not a valid email');
 *   }
 * }
 *
 * // Use the make function to create an Email
 * const myEmail = make('test@example.com', assertIsEmail); // This will pass
 * const notEmail = make('not an email', assertIsEmail); // This will throw an error
 */
export const make = <T, BrandName extends string, BrandedType extends Branded<T, BrandName>>(
	value: T,
	assertFn: (x: T) => asserts x is BrandedType
): BrandedType => {
	assertFn(value);
	return value;
};
