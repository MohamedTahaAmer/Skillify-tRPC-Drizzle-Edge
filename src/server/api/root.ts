import { createTRPCRouter } from "@/server/api/trpc"
import { chaptersRouter } from "./routers/chapters"
import { coursesRouter } from "./routers/courses"
import { getRouter } from "./routers/get"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	courses: coursesRouter,
	chapters: chaptersRouter,
	get: getRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
