import { logTime } from "@/lib/logTime"
import { db, schema } from "@/server/db"
import { and, eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getUserCoursesProgress(userId: string) {
	try {
		let startTime = Date.now()

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
	} catch (error) {
		console.error(error)
	}
}

export async function addFitnessCourse() {
	let startTime = Date.now()
	let course = await db.query.courses.findFirst({
		where: inArray(
			schema.courses.categoryId,
			db
				.select({ id: schema.categories.id })
				.from(schema.categories)
				.where(and(eq(schema.categories.name, "Fitness"))),
		),
	})
	if (course) {
		await db.insert(schema.courses).values({
			...course,
			id: undefined,
			title: "Fitness Course - test" + Math.random().toFixed(2),
		})
	}
	logTime({ title: "3- Time to add fitness course", startTime })
	revalidatePath("/test/drizzle")
	return course
}
