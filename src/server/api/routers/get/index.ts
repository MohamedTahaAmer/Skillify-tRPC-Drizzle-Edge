import { z } from "zod"
import getUserCoursesProgress from "./user-courses-progress"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const getRouter = createTRPCRouter({
	getUserCoursesProgress: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				categoryId: z.string().optional(),
				title: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			let { userId, categoryId, title } = input
			let userCoursesProgress = await getUserCoursesProgress({
				userId,
				categoryId,
				title,
			})
			return userCoursesProgress
		}),
})
