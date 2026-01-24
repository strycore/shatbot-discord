import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				console: "readonly",
				process: "readonly",
				fetch: "readonly",
				URL: "readonly",
				URLSearchParams: "readonly",
			}
		},
		rules: {
			"quotes": [1, "double"],
			"indent": ["error", "tab", { "SwitchCase": 1 }],
			"eol-last": "error",
			"no-console": "off",
			"spaced-comment": "off",
			"no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
		}
	}
];
