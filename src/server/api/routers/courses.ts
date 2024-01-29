import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkout } from "./courses-helpers/checkout"
import updateProgress from "./courses-helpers/update-progress"
// import { posts } from "@/server/db/schema"

export const coursesRouter = createTRPCRouter({
	checkout: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let url = await checkout({ user: ctx.user, courseId: input.courseId })
			return { url }
		}),

	updateProgress: protectedProcedure
		.input(z.object({ isCompleted: z.boolean(), chapterId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let userProgress = await updateProgress({
				userId: ctx.user.id,
				isCompleted: input.isCompleted,
				chapterId: input.chapterId
			})
			return { userProgress }
		})
})
