//#region // < getUserPurchasedCoursesWithCompletedChapters
import { db, schema } from "@/server/db"
import { and, eq, inArray } from "drizzle-orm"

export async function getUserPurchasedCoursesWithCompletedChapters(userId: string) {
	try {
		let courses = await db.query.courses.findMany({
			where: and(
				eq(schema.courses.isPublished, true),
				inArray(
					schema.courses.id,
					db
						.select({ courseId: schema.purchases.courseId })
						.from(schema.purchases)
						.where(eq(schema.purchases.userId, userId)),
				),
			),
			with: {
				chapters: {
					where: and(
						eq(schema.chapters.isPublished, true),
						inArray(
							schema.chapters.id,
							db
								.select({ chapterId: schema.userProgress.chapterId })
								.from(schema.userProgress)
								.where(and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.isCompleted, true))),
						),
					),
				},
			},
		})
		console.log(courses)
		console.log(courses.length)
		courses.map((course) => {
			console.log(course.title)
			console.log(course.chapters.length)
		})
	} catch (error) {
		console.error(error)
	}
}

//#endregion
