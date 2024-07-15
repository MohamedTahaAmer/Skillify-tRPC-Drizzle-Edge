import { logTime } from "@/lib/helpers"
import { schema } from "@/server/db"
import { and, eq, inArray } from "drizzle-orm"
import { ProtectedCTX } from "../../trpc"
export default async function getUserCoursesWithProgress({ ctx }: { ctx: ProtectedCTX }) {
	let { db, user } = ctx
	let userId = user.id
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
						where: and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.isCompleted, true)),
					},
				},
			},
		},
	})
	logTime({ title: "2- Time to get user courses progress", startTime })

	return courses
}
