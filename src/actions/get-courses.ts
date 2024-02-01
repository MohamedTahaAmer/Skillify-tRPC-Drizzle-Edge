import type { Category, Course } from "@prisma/client"

import { getProgress } from "@/actions/get-progress"
import { db } from "@/lib/db"

type CourseWithProgressWithCategory = Course & {
	category: Category | null
	chapters: { id: string }[]
	progress: number | null
}

type GetCourses = {
	userId: string
	title?: string
	categoryId?: string
	purchaced?: string
}

export const getCourses = async ({
	userId,
	title,
	categoryId,
	purchaced,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
	type Where = {
		isPublished: true
		title: {
			contains: string | undefined
		}
		categoryId: string | undefined
		purchases?: {
			some: {
				userId: string
			}
		}
	}
	let whereClouse: Where = {
		isPublished: true,
		title: {
			contains: title,
		},
		categoryId,
	}
	if (purchaced) {
		whereClouse = {
			...whereClouse,
			purchases: {
				some: {
					userId,
				},
			},
		}
	}
	try {
		const courses = await db.course.findMany({
			where: whereClouse,
			include: {
				category: true,
				chapters: {
					where: {
						isPublished: true,
					},
					select: {
						id: true,
					},
				},
				purchases: {
					where: {
						userId,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		})

		const coursesWithProgress: CourseWithProgressWithCategory[] =
			await Promise.all(
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

		return coursesWithProgress
	} catch (error) {
		console.log("[GET_COURSES]", error)
		return []
	}
}
