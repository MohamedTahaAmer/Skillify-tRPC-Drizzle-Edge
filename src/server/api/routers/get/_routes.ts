import { z } from "zod"
import getUserCoursesWithProgress from "./user-courses-with-progress"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"
import getAllPublishedCourses from "./all-published-courses"
import { revalidatePath } from "next/cache"

export const getRouter = createTRPCRouter({
	getUserCoursesWithProgress: protectedProcedure.query(getUserCoursesWithProgress),

	getAllPublishedCourses: publicProcedure.query(getAllPublishedCourses),
	validatePath: publicProcedure.input(z.string()).mutation(({ input }) => {
		console.log(input)
		revalidatePath(input || "/")
	}),
})
