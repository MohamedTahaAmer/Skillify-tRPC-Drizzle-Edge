import { db, schema } from "@/server/db"
import { and, eq, inArray, like } from "drizzle-orm"

import { getProgress } from "@/actions/get-progress"

type CourseWithProgressWithCategory = schema.CoursesSelect & {
	category: schema.CategoriesSelect
	chapters: schema.ChaptersSelect[]
	progress: number
}

type DashboardCourses = {
	completedCourses: CourseWithProgressWithCategory[]
	coursesInProgress: CourseWithProgressWithCategory[]
}

export const getDashboardCourses = async ({
	userId,
	categoryId,
	title,
}: {
	userId: schema.PurchasesSelect["userId"]
	categoryId?: schema.CoursesSelect["categoryId"]
	title?: schema.CoursesSelect["title"]
}): Promise<DashboardCourses> => {
	try {
		let purchasedCourses = await db.query.purchases.findMany({
			where: and(
				eq(schema.purchases.userId, userId),
				inArray(
					schema.purchases.courseId,
					db
						.select({ id: schema.courses.id })
						.from(schema.courses)
						.where(
							and(
								eq(schema.courses.isPublished, true),
								categoryId
									? eq(schema.courses.categoryId, categoryId)
									: undefined,
								title ? like(schema.courses.title, `%${title}%`) : undefined,
							),
						),
				),
			),
			with: {
				course: {
					with: {
						category: true,
						chapters: {
							where: eq(schema.chapters.isPublished, true),
						},
					},
				},
			},
		})

		const courses = purchasedCourses.map(
			(purchase) => purchase.course,
		) as CourseWithProgressWithCategory[]

		for (let course of courses) {
			const { progressPercentage } = await getProgress(userId, course.id)
			course.progress = progressPercentage
		}

		const completedCourses = courses.filter((course) => course.progress === 100)
		const coursesInProgress = courses.filter(
			(course) => (course.progress ?? 0) < 100,
		)

		return {
			completedCourses,
			coursesInProgress,
		}
	} catch (error) {
		console.log("[GET_DASHBOARD_COURSES]", error)
		return {
			completedCourses: [],
			coursesInProgress: [],
		}
	}
}
