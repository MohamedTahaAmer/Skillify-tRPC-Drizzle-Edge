import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { addChapter } from "./add-chapter"
import { reorderChapters } from "./reorder-chapters"
import {
	chapterValidator,
	deleteChapter,
	patchChapter,
} from "./delete-patch-chapters"
import { publish, unpublish } from "./un-publish"
export const chaptersRouter = createTRPCRouter({
	addChapter: protectedProcedure
		.input(
			z.object({ courseId: z.string().min(1), title: z.string().min(1) }),
		)
		.mutation(async ({ ctx, input }) => {
			let chapter = await addChapter({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				title: input.title,
			})
			return { chapter }
		}),
	reorderChapters: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				list: z
					.object({ id: z.string().min(1), position: z.number() })
					.array(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let res = await reorderChapters({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				list: input.list,
			})
			return { res }
		}),
	deleteChapter: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				chapterId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let res = await deleteChapter({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				chapterId: input.chapterId,
			})
			return { res }
		}),
	patchChapter: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				chapterId: z.string().min(1),
				chapterNewValues: chapterValidator,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let res = await patchChapter({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				chapterId: input.chapterId,
				chapterNewValues: input.chapterNewValues,
			})
			return { res }
		}),
	publishChapter: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				chapterId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let res = await publish({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				chapterId: input.chapterId,
			})
			return { res }
		}),

	unPublishChapter: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				chapterId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let res = await unpublish({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				chapterId: input.chapterId,
			})
			return { res }
		}),
})
