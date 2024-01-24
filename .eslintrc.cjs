/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort', 'regex'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.ts'],

			extends: ['plugin:@typescript-eslint/strict-type-checked'],

			parserOptions: {
				project: ['./tsconfig.json']
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
			files: ['**/domain/**/*.ts'],
			rules: {
				'@typescript-eslint/no-throw-literal': 'off'
			}
		}
	],
	rules: {
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
		],
		'@typescript-eslint/no-unused-vars': [
			'warn', // or "error"
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_'
			}
		],
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					['^\\u0000'],
					['^(?!@|generated|bin|tasks|rest-routes|middleware|service|utils|schema)\\w'],
					['^@?\\w'],
					['^(generated|bin|tasks|rest-routes|middleware)\\w'],
					['^(service|utils|schema)\\w'],
					['^'],
					['^\\.']
				]
			}
		],
		'sort-imports': 0,
		'regex/invalid': [
			'warn',
			[
				{
					regex: 'throw\\s+(new\\s+)?Error',
					message: 'Use errorHandler.throw() to throw Error in the domain services.',
					files: {
						inspect: '.*domain.*\\/service.*\\.ts',
						ignore: '.*(tests|mocks).*\\.ts'
					}
				},
				{
					regex: "import.*from\\s+\\'(?!\\$domain|{\\.}{1,2}/|).*",
					message: 'Import from the domain only.',
					files: {
						inspect: '.*domain.*/.*\\.ts'
					}
				}
			]
		]
	}
};
