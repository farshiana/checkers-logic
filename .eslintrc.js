module.exports = {
	parser: 'babel-eslint',
	extends: ['airbnb-base', 'prettier'],
	plugins: ['prettier', 'babel'],
	env: {
		jest: true
	},
	rules: {
		'indent': [2, 'tab'],
		'no-tabs': 0,
		'no-continue': 0,
		'no-param-reassign': 0,
		'prefer-destructuring': 0,
		'no-console': 0,
	}
}
