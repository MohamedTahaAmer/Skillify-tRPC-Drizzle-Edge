import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkout } from "./courses-helpers/checkout"
// import { posts } from "@/server/db/schema"

export const coursesRouter = createTRPCRouter({
	checkout: protectedProcedure
		.input(z.object({ courseId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			let url = await checkout({ user: ctx.user, courseId: input.courseId })
			return { url }
		})
})
