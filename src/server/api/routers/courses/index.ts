import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkout } from "./checkout"
import updateProgress from "./update-progress"
import { publish, unpublish } from "./un-publish"
import {
	courseValidator,
	deleteCourse,
	patchCourse,
} from "./delete-patch-course"
import { addAttachment, deleteAttachment } from "./add-delete-attachment"
import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"

export const coursesRouter = createTRPCRouter({
	checkout: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let url = await checkout({
				user: ctx.user,
				courseId: input.courseId,
				db: ctx.db,
			})
			return { url }
		}),

	updateProgress: protectedProcedure
		.input(
			z.object({
				isCompleted: z.boolean(),
				chapterId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let userProgress = await updateProgress({
				userId: ctx.user.id,
				isCompleted: input.isCompleted,
				chapterId: input.chapterId,
				db: ctx.db,
			})
			return { userProgress }
		}),
	publish: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let publishedCourse = await publish({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id,
			})
			return { publishedCourse }
		}),

	unpushlish: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let unpublishedCourse = await unpublish({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id,
			})
			return { unpublishedCourse }
		}),
	patchCourse: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				courseNewValues: courseValidator,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let course = await patchCourse({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id,
				courseNewValues: input.courseNewValues,
			})
			return { course }
		}),
	deleteCourse: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let course = await deleteCourse({
				db: ctx.db,
				courseId: input.courseId,
				userId: ctx.user.id,
			})
			return { course }
		}),
	addAttachment: protectedProcedure
		.input(z.object({ courseId: z.string().min(1), url: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let attachment = await addAttachment({
				db: ctx.db,
				courseId: input.courseId,
				url: input.url,
				userId: ctx.user.id,
			})
			return { attachment }
		}),
	deleteAttachment: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				attachmentId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let attachment = await deleteAttachment({
				db: ctx.db,
				courseId: input.courseId,
				attachmentId: input.attachmentId,
				userId: ctx.user.id,
			})
			return { attachment }
		}),
	create: protectedProcedure
		.input(z.object({ title: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(schema.courses).values({
				title: input.title,
				userId: ctx.user.id,
			})
			let course = (
				await ctx.db
					.selectDistinct()
					.from(schema.courses)
					.where(
						(and(eq(schema.courses.title, input.title)),
						eq(schema.courses.userId, ctx.user.id)),
					)
			)[0]
			return { course }
		}),
})
