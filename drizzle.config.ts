import { env } from "./src/env.js"
import type { Config } from "drizzle-kit"

export let dbName = "skillify_edge_dev_1_"

export default {
	schema: "./src/server/db/schema.ts",
	out: "./drizzle",
	driver: "mysql2",
	dbCredentials: {
		uri: env.DATABASE_URL,
	},
	tablesFilter: [`${dbName}*`],
} satisfies Config
