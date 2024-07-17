import { z } from "zod"
import getUserCoursesWithProgress from "./user-courses-with-progress"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"
import getAllPublishedCourses from "./all-published-courses"
import { revalidatePath } from "next/cache"

export const getRouter = createTRPCRouter({
	getUserCoursesWithProgress: protectedProcedure.query(getUserCoursesWithProgress),

	getAllPublishedCourses: publicProcedure.query(getAllPublishedCourses),
	validatePath: publicProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/auth/login",
				tags: ["auth"],
				summary: "Login as an existing user",
			},
		})
		.input(z.object({ path: z.string() }))
		.output(z.void())
		.mutation(({ input }) => {
			console.log(input)
			revalidatePath(input.path || "/")
		}),
})
