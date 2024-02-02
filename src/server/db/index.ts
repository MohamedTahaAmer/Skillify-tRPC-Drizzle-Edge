import { Client } from "@planetscale/database"
import { drizzle } from "drizzle-orm/planetscale-serverless"

import * as schema from "./schema"
import { env } from "@/env"

export const drizzleDb = drizzle(
	new Client({
		url: env.SQL_DATABASE_URL,
	}).connection(),
	{ schema },
)
