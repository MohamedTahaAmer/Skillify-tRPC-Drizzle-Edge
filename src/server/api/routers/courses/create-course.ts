import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

export async function createCourse({
	title,
	userId,
	db,
}: {
	title: schema.CoursesInsert["title"]
	userId: schema.CoursesInsert["userId"]
	db: PlanetScaleDatabase<typeof schema>
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

	return course
}
