import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { addChapter } from "./add-chapter"
import { reorderChapters } from "./reorder-chapters"

export const chaptersRouter = createTRPCRouter({
	addChapter: protectedProcedure
		.input(z.object({ courseId: z.string().min(1), title: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let chapter = await addChapter({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				title: input.title
			})
			return { chapter }
		}),
	reorderChapters: protectedProcedure
		.input(
			z.object({
				courseId: z.string().min(1),
				list: z.object({ id: z.string().min(1), position: z.number() }).array()
			})
		)
		.mutation(async ({ ctx, input }) => {
			let res = await reorderChapters({
				userId: ctx.user.id,
				courseId: input.courseId,
				db: ctx.db,
				list: input.list
			})
			return { res }
		})
})
