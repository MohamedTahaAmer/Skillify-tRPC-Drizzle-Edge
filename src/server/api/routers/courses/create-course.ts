import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { revalidatePath } from "next/cache"

export async function createCourse({
	title,
	userId,
	db,
}: {
	title: schema.CoursesInsert["title"]
	userId: schema.CoursesInsert["userId"]
	db: MySql2Database<typeof schema>
}) {
	await db.insert(schema.courses).values({
		userId,
		title,
	})
	let course = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.userId, userId), eq(schema.courses.title, title)),
			)
	)[0]

	revalidatePath("/")
	return course
}
