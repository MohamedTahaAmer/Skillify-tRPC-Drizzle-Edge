import { env } from "@/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: "./src/server/db/schema.ts",
	out: "./drizzle",
	dialect: "mysql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	tablesFilter: [env.DATABASE_PREFIX],
})
