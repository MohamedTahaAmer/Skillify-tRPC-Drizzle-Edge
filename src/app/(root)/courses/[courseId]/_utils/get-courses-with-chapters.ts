import { logTime } from "@/lib/helpers"
import { db, schema } from "@/server/db"
import { and, asc, eq } from "drizzle-orm"
import { cache } from "react"
let getCourseWithChapters = async ({
	courseId,
	userId,
}: {
	courseId: schema.CoursesSelect["id"]
	userId: schema.UserProgressSelect["userId"] | null
}) => {
	let startTimer = Date.now()
	let courses = await db.query.courses.findFirst({
		where: eq(schema.courses.id, courseId),
		with: {
			chapters: {
				where: and(eq(schema.chapters.isPublished, true)),
				with: {
					userProgress: userId
						? {
								where: eq(schema.userProgress.userId, userId),
							}
						: undefined,
				},
				orderBy: asc(schema.chapters.position),
			},
			purchases: userId
				? { where: eq(schema.purchases.userId, userId) }
				: undefined,
			attachments: true,
		},
	})

	logTime({ title: "getCourseWithChapters", startTime: startTimer })
	return courses
}

let cachedGetCourseWithChapters = cache(getCourseWithChapters)
export default cachedGetCourseWithChapters
