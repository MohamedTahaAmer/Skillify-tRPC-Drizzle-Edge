import { db, schema } from "@/server/db"
import { and, desc, eq } from "drizzle-orm"

export const getAllCourses = async () => {
	try {
		let courses = await db.query.courses.findMany({
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
			orderBy: desc(schema.courses.createdAt),
		})

		return courses
	} catch (error) {
		console.log("[GET_COURSES]", error)
		return []
	}
}
