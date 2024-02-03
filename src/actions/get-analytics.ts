import { db, schema } from "@/server/db"
import { eq, inArray } from "drizzle-orm"

type PurchaseWithCourse = schema.PurchasesSelect & {
	course: schema.CoursesSelect
}

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
	const grouped: Record<string, number> = {}

	purchases.forEach((purchase) => {
		const courseTitle = purchase.course.title
		if (!grouped[courseTitle]) {
			grouped[courseTitle] = 0
		}
		grouped[courseTitle] += purchase.course.price!
	})

	return grouped
}

export const getAnalytics = async (userId: string) => {
	try {
		let purchases = await db.query.purchases.findMany({
			where: inArray(
				schema.purchases.courseId,
				db
					.select({ id: schema.purchases.courseId })
					.from(schema.purchases)
					.where(eq(schema.purchases.userId, userId)),
			),
			with: {
				course: true,
			},
		})

		const groupedEarnings = groupByCourse(purchases)
		const data = Object.entries(groupedEarnings).map(
			([courseTitle, total]) => ({
				name: courseTitle,
				total: total,
			}),
		)

		const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
		const totalSales = purchases.length

		return {
			data,
			totalRevenue,
			totalSales,
		}
	} catch (error) {
		console.log("[GET_ANALYTICS]", error)
		return {
			data: [],
			totalRevenue: 0,
			totalSales: 0,
		}
	}
}
