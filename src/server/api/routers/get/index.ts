import { z } from "zod"
import getUserCoursesWithProgress from "./user-courses-with-progress"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

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
})
