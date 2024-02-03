import { db, schema } from "@/server/db"
import { and, desc, eq, inArray, like } from "drizzle-orm"

import { getProgress } from "@/actions/get-progress"

type CourseWithProgressWithCategory = schema.CoursesSelect & {
	category: schema.CategoriesSelect | null
	chapters: { id: schema.ChaptersSelect["id"] }[]
	progress?: number | null
}

type GetCourses = {
	userId: schema.PurchasesSelect["userId"] | null
	title?: schema.CoursesSelect["title"]
	categoryId?: schema.CoursesSelect["categoryId"]
	purchased?: string
}

export const getCourses = async ({
	userId,
	title,
	categoryId,
	purchased,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
	try {
		let courses = await db.query.courses.findMany({
			where: and(
				eq(schema.courses.isPublished, true),
				title ? like(schema.courses.title, title) : undefined,
				categoryId ? eq(schema.courses.categoryId, categoryId) : undefined,
				userId && purchased
					? inArray(
							schema.courses.id,
							db
								.select({ id: schema.purchases.courseId })
								.from(schema.purchases)
								.where(eq(schema.purchases.userId, userId)),
						)
					: undefined,
			),
			with: {
				category: true,
				chapters: {
					where: eq(schema.chapters.isPublished, true),
					columns: {
						id: true,
					},
				},
				purchases: userId
					? {
							where: eq(schema.purchases.userId, userId),
						}
					: undefined,
			},
			orderBy: desc(schema.courses.createdAt),
		})

		courses = userId
			? await Promise.all(
					courses.map(async (course) => {
						if (course.purchases.length === 0) {
							return {
								...course,
								progress: null,
							}
						}

						const progressPercentage = await getProgress(userId, course.id)

						return {
							...course,
							progress: progressPercentage,
						}
					}),
				)
			: courses

		return courses
	} catch (error) {
		console.log("[GET_COURSES]", error)
		return []
	}
}
