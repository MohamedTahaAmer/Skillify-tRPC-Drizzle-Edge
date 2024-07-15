const config = {
	extends: ["next/core-web-vitals", "next", "prettier", "plugin:tailwindcss/recommended"],
	rules: {
		"prefer-const": "off",
		"no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
	},
}

module.exports = config
