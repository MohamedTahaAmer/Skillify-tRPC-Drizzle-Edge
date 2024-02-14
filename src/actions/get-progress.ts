import { db, schema } from "@/server/db"
import { and, count, eq, inArray } from "drizzle-orm"

export const getProgress = async (
	userId: schema.UserProgressSelect["userId"],
	courseId: schema.ChaptersSelect["courseId"],
) => {
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

		let validCompletedChapters = (
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

		let numOfCompletedChapters = validCompletedChapters?.count ?? 0
		let numOfPublishedChapters = publishedChapterIds.length

		const progressPercentage =
			(numOfCompletedChapters / numOfPublishedChapters) * 100

		return {
			progressPercentage,
			numOfCompletedChapters,
			numOfPublishedChapters,
		}
	} catch (error) {
		console.log("[GET_PROGRESS]", error)
		return {
			progressPercentage: 0,
			numOfCompletedChapters: 0,
			numOfPublishedChapters: 0,
		}
	}
}
