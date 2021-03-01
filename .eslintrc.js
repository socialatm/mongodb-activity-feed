module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
		'shared-node-browser': true,
		mocha: true,
	},
	extends: ['eslint:recommended'],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true,
		},
		sourceType: 'module',
	},
	plugins: [],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'jsx-quotes': ['error', 'prefer-double'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'comma-dangle': ['error', 'always-multiline'],
		'no-case-declarations': 'off',
		eqeqeq: 'warn',
		'quote-props': ['warn', 'consistent-as-needed'],
		'no-console': 0,
		'keyword-spacing': ['error'],
		'linebreak-style': 0,
	},
}
