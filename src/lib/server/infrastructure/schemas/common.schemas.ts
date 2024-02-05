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

export const ISOLanguage = z.union([z.literal('fr'), z.literal('en')]);
export const Locale = z.union([FrenchLocales, EnglishLocales]);
