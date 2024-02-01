import { createTRPCRouter } from "@/server/api/trpc"
import { chaptersRouter } from "./routers/chapters"
import { coursesRouter } from "./routers/courses"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	// post: postRouter,
	courses: coursesRouter,
	chapters: chaptersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
