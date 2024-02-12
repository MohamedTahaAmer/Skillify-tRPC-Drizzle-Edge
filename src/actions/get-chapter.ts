import { db, schema } from "@/server/db"
import { and, asc, eq, gt } from "drizzle-orm"

interface GetChapterProps {
	userId?: schema.CoursesSelect["userId"] | null
	courseId: schema.PurchasesSelect["courseId"]
	chapterId: schema.ChaptersSelect["id"]
}

export const getChapter = async ({
	userId,
	courseId,
	chapterId,
}: GetChapterProps) => {
	try {
		let chapter = (
			await db
				.selectDistinct()
				.from(schema.chapters)
				.where(
					and(
						eq(schema.chapters.id, chapterId),
						eq(schema.chapters.isPublished, true),
					),
				)
		)[0]

		if (!chapter) {
			throw new Error("Chapter or course not found")
		}

		let muxData = null
		let attachments: schema.AttachmentsSelect[] = []
		let nextChapter: schema.ChaptersSelect | undefined = undefined

		attachments = await db
			.select()
			.from(schema.attachments)
			.where(eq(schema.attachments.courseId, courseId))

		if (!!chapter?.isFree) {
			muxData = (
				await db
					.selectDistinct()
					.from(schema.muxData)
					.where(eq(schema.muxData.chapterId, chapterId))
			)[0]

			nextChapter = (
				await db
					.select()
					.from(schema.chapters)
					.where(
						and(
							eq(schema.chapters.courseId, courseId),
							eq(schema.chapters.isPublished, true),
							gt(schema.chapters.position, chapter?.position ?? 0),
						),
					)
					.orderBy(asc(schema.chapters.position))
					.limit(1)
			)[0]
		}

		let userProgress = userId
			? (
					await db
						.selectDistinct()
						.from(schema.userProgress)
						.where(
							and(
								eq(schema.userProgress.userId, userId),
								eq(schema.userProgress.chapterId, chapterId),
							),
						)
				)[0]
			: undefined

		return {
			chapter,
			muxData,
			attachments,
			nextChapter,
			userProgress,
		}
	} catch (error) {
		console.log("[GET_CHAPTER]", error)
		return {
			chapter: null,
			muxData: null,
			attachments: [],
			nextChapter: null,
			userProgress: null,
		}
	}
}
