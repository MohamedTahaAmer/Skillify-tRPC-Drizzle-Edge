import { logTime } from "@/lib/helpers"
import { db, schema } from "@/server/db"
import { and, asc, eq } from "drizzle-orm"

export default async function getAllPublishedCourses() {
	let startTime = Date.now()

	startTime = Date.now()
	const allCourses = await db.query.courses.findMany({
		where: and(eq(schema.courses.isPublished, true)),
		with: {
			category: true,
			chapters: {
				where: eq(schema.chapters.isPublished, true),
				columns: {
					id: true,
				},
			},
		},
		orderBy: asc(schema.courses.createdAt),
	})
	logTime({ title: "1- Time to get all courses", startTime })

	return allCourses
}
