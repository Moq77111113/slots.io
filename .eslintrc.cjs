/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/prettier',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'regex'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts', 'postcss.config.cjs'],
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	globals: { $$Generic: 'readable', _: 'writable' },
	overrides: [
		{
			files: ['*.ts'],
			extends: ['plugin:@typescript-eslint/strict-type-checked'],

			parserOptions: {
				project: ['./tsconfig.json']
			}
		},
		{
			files: ['**/domain/**/*.ts', '**/+page.server.ts', '**/+server.ts'],
			rules: {
				'@typescript-eslint/no-throw-literal': 'off'
			}
		},
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			rules: {
				'@typescript-eslint/ban-types': [
					'error',
					{
						extendDefaults: true,
						types: {
							'{}': false
						}
					}
				]
			}
		}
	],
	rules: {
		'no-unused-vars': 'off',
		'sort-imports': 'warn',

		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^(\\$\\$(Props|Events|Slots|Generic)|_.*)$',
				caughtErrorsIgnorePattern: '^_'
			}
		],
		'regex/invalid': [
			'warn',
			[
				{
					regex: 'throw\\s+(new\\s+)?Error',
					message: 'Use errorHandler.throw() to throw Error in the domain services.',
					files: {
						inspect: '.*domain.*\\/service.*\\.ts',
						ignore: '.*(tests?|mocks).*\\.ts'
					}
				},
				{
					regex: "import.*from\\s+\\'(?!#\\/domain|\\.){1,2}/).*",
					message: 'Import from the domain only.',
					files: {
						inspect: '.*domain.*/.*\\.ts'
					}
				}
			]
		]
	}
};
