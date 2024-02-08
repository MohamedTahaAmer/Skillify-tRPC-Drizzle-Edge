import { logTime } from "@/lib/logTime"
import { db, schema } from "@/server/db"
import { and, eq, inArray, like } from "drizzle-orm"
export default async function getUserCoursesProgress({
	userId,
	categoryId,
	title,
}: {
	userId: string
	categoryId?: string
	title?: string
}) {
	let startTime = Date.now()

	let courses = await db.query.courses.findMany({
		where: and(
			eq(schema.courses.isPublished, true),
			categoryId ? eq(schema.courses.categoryId, categoryId) : undefined,
			title ? like(schema.courses.title, `%${title}%`) : undefined,
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
				where: and(eq(schema.chapters.isPublished, true)),
				with: {
					userProgress: {
						where: and(
							eq(schema.userProgress.userId, userId),
							eq(schema.userProgress.isCompleted, true),
						),
					},
				},
			},
		},
	})
	logTime({ title: "2- Time to get user courses progress", startTime })

	let numOfCompletedCourses = courses.reduce((acc, course) => {
		let numOfAllChapters = course.chapters.length
		let numOfCompletedChapters = course.chapters.reduce((acc, chapter) => {
			if (chapter.userProgress.length > 0) {
				acc++
			}
			return acc
		}, 0)
		if (numOfAllChapters === numOfCompletedChapters) {
			acc++
		}
		return acc
	}, 0)
	let numOfUnCompletedCourses = courses.length - numOfCompletedCourses
	return { numOfCompletedCourses, numOfUnCompletedCourses }
}
