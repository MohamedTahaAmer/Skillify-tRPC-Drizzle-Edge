import { db, schema } from "@/server/db"
import { and, count, eq, inArray } from "drizzle-orm"

export const getProgress = async (
	userId: schema.UserProgressSelect["userId"],
	courseId: schema.ChaptersSelect["courseId"],
): Promise<number> => {
	try {
		let publishedChapters = await db
			.select({ id: schema.chapters.id })
			.from(schema.chapters)
			.where(
				and(
					eq(schema.chapters.courseId, courseId),
					eq(schema.chapters.isPublished, true),
				),
			)

		const publishedChapterIds = publishedChapters.map((chapter) => chapter.id)

		let validCompletedChapters  = (
			await db
				.select({ count: count() })
				.from(schema.userProgress)
				.where(
					and(
						eq(schema.userProgress.userId, userId),
						inArray(schema.userProgress.chapterId, publishedChapterIds),
						eq(schema.userProgress.isCompleted, true),
					),
				)
		)[0]

		const progressPercentage =
			(validCompletedChapters?.count ?? 0 / publishedChapterIds.length) * 100

		return progressPercentage
	} catch (error) {
		console.log("[GET_PROGRESS]", error)
		return 0
	}
}
