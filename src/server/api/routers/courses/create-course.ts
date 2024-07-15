import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { ProtectedCTX } from "../../trpc"

export let createCourseDTO = z.object({ title: z.string().min(1) })
type CreateCourseDTO = z.infer<typeof createCourseDTO>
export async function createCourse({ ctx, input }: { ctx: ProtectedCTX; input: CreateCourseDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { title } = input
	// await db.insert(schema.courses).values({
	// 	userId,
	// 	title,
	// })
	let course = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where((and(eq(schema.courses.title, title)), eq(schema.courses.userId, userId)))
	)[0]

	// revalidatePath("/")
	return { course }
}
