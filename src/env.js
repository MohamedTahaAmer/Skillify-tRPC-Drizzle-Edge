import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"
export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z
			.string()
			.refine((str) => !str.includes("YOUR_MYSQL_URL_HERE"), "You forgot to change the default URL"),
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
		CLERK_SECRET_KEY: z.string(),
		MUX_TOKEN_ID: z.string(),
		MUX_TOKEN_SECRET: z.string(),
		UPLOADTHING_SECRET: z.string(),
		UPLOADTHING_APP_ID: z.string(),
		STRIPE_API_KEY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string(),
		DATABASE_PREFIX: z.string(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
		NEXT_PUBLIC_APP_URL: z.string(),
		NEXT_PUBLIC_TEACHER_ID: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtime s (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		NEXT_PUBLIC_TEACHER_ID: process.env.NEXT_PUBLIC_TEACHER_ID,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
		MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
		UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
		UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
		STRIPE_API_KEY: process.env.STRIPE_API_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_PREFIX: process.env.DATABASE_PREFIX,
		NODE_ENV: process.env.NODE_ENV,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
})
