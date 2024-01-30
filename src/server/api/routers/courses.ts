import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkout } from "./courses-helpers/checkout"
import updateProgress from "./courses-helpers/update-progress"
import { publish, unpublish } from "./courses-helpers/un-publish"
import {
	courseValidator,
	deleteCourse,
	patchCourse
} from "./courses-helpers/delete-patch-course"

export const coursesRouter = createTRPCRouter({
	checkout: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let url = await checkout({
				user: ctx.user,
				courseId: input.courseId,
				db: ctx.db
			})
			return { url }
		}),

	updateProgress: protectedProcedure
		.input(z.object({ isCompleted: z.boolean(), chapterId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let userProgress = await updateProgress({
				userId: ctx.user.id,
				isCompleted: input.isCompleted,
				chapterId: input.chapterId,
				db: ctx.db
			})
			return { userProgress }
		}),
	publish: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let publishedCourse = await publish({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id
			})
			return { publishedCourse }
		}),

	unpushlish: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let unpublishedCourse = await unpublish({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id
			})
			return { unpublishedCourse }
		}),
	patchCourse: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				courseNewValues: courseValidator
			})
		)
		.mutation(async ({ ctx, input }) => {
			let course = await patchCourse({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id,
				courseNewValues: input.courseNewValues
			})
			return { course }
		}),
	deleteCourse: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let course = await deleteCourse({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id
			})
			return { course }
		})
})
