import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		css: true,
		setupFiles: ["/src/__test__/__setup/setupTests.ts"],
	},
	resolve: {
		alias: {
			"@": "/src",
		},
	},
})
