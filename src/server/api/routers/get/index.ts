import { z } from "zod"
import getUserCoursesWithProgress from "./user-courses-with-progress"
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc"
import getAllPublishedCourses from "./all-published-courses"

export const getRouter = createTRPCRouter({
	getUserCoursesWithProgress: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
			}),
		)
		.query(async ({ input }) => {
			let { userId } = input
			let userCoursesProgress = await getUserCoursesWithProgress({
				userId,
			})
			return userCoursesProgress
		}),

	getAllPublishedCourses: publicProcedure.query(async () => {
		return getAllPublishedCourses()
	}),
})
